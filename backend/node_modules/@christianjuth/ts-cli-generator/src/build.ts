// @ts-ignore
import chmod from "chmod";
import dedent from "dedent";
import { promises as fs } from "fs";
import kleur from "kleur";
import { createSpinner } from "nanospinner";
// @ts-ignore
import { symbols } from "nanospinner/consts";
import path from "path";
import type { FunctionDeclaration, Node, ts, Type } from "ts-morph";
import { config } from "./config";
import { Events } from "./types";

async function crawlRecursive(
  entry: string,
  visited: Record<string, boolean> = {}
) {
  if (visited[entry]) {
    return visited;
  }
  visited[entry] = true;

  const dir = path.dirname(entry);

  let data = "";
  try {
    data = await fs.readFile(entry + ".ts", "utf8");
  } catch (e) {
    return visited;
  }

  const importRegEx =
    /import(?:['"\s]*([\w*${}\s,]+)from\s*)?['"\s]['"\s](.*[@\w_-]+)['"\s].*/gm;

  const imps =
    data.match(importRegEx)?.filter((imp) => /("|')\./.test(imp)) ?? [];

  for (const imp of imps) {
    let importedFile = imp.match(/(".+"|'.+')/)?.[0];
    if (importedFile) {
      importedFile = importedFile.replace(/("|')/g, "");
      const importedFilePath = path.join(dir, importedFile);
      await crawlRecursive(importedFilePath, visited);
    }
  }

  return visited;
}

async function crawl(entry: string) {
  const visited = await crawlRecursive(entry.replace(/\.ts$/, ""));
  return Object.keys(visited).map((imp) => `${imp}.ts`);
}

function uuid() {
  function randomString() {
    return Math.random().toString(36).substring(2);
  }

  return Array(4).fill(0).map(randomString).join("-");
}

async function buildTypeScript(tmpBuiltPath: string) {
  const { ts } = await import("ts-morph");

  await fs.writeFile(
    tmpBuiltPath,
    dedent`
      #!/usr/bin/env node
      import { cli } from "./index";
      import { run } from "${config.packageName}";
      run(__dirname, cli);
    `
  );

  try {
    const emitSpinner = createSpinner("Emitting CLI build");

    const program = ts.createProgram([tmpBuiltPath], {
      module: ts.ModuleKind.CommonJS,
      sourceMap: false,
      outDir: config.getOutputDir(),
    });

    program.emit();

    fs.unlink(tmpBuiltPath);
    tmpBuiltPath = tmpBuiltPath.replace(/\.ts$/, ".js");

    chmod(path.join(config.getOutputDir(), tmpBuiltPath), {
      execute: true,
    });

    fs.rename(
      path.join(config.getOutputDir(), tmpBuiltPath),
      path.join(config.getOutputDir(), "cli.js")
    );

    emitSpinner.success();
  } catch (e) {
    console.log(e);
    // cleanup
    fs.unlink(tmpBuiltPath);
  }
}

type ParamType = string | ParamItem;

type ParamItem = {
  name: string;
  key?: string;
  index?: number;
  types?: ParamType[];
  object?: ParamItem[];
};

async function buildCli() {
  const { Project } = await import("ts-morph");

  const detectingTypesspinner = createSpinner("Detecting CLI commands").start();

  const project = new Project({
    compilerOptions: { outDir: "dist", declaration: true, strict: true },
  });

  const files = await crawl(config.tsEntry);
  const functions: Record<string, FunctionDeclaration[]> = {};

  for (const path of files) {
    project.addSourceFilesAtPaths(path);
    const file = project.getSourceFile(path);

    if (!file) {
      console.error(kleur.red(`${path} does not exsist`));
    } else {
      const key = path.replace(config.cliRoot, "").replace(/\.ts/, "");
      if (functions[key]) {
        throw Error(`encountered duplicate file ${file}`);
      }
      functions[key] = [];

      const fns = file.getFunctions().filter((fn) => {
        const name = fn.getName() as keyof Events;
        return name && !config.internalMethods.includes(name);
      });
      functions[key].push(...fns);
    }
  }

  const definitions: {
    params: ParamItem[];
    description: string;
    file: string;
    name: string;
  }[] = [];

  function buildParamTypes(
    type: Type<ts.Type>,
    extraInfo: {
      node?: Node<ts.Node>;
      key?: string;
      name?: string;
    }
  ): ParamItem {
    const { node, key } = extraInfo;
    const name = extraInfo.name ?? "";

    const types = (type.isUnion() ? type.getUnionTypes() : [type])
      .map((unionType) => {
        const unionTypeName = unionType.getText();

        if (unionType.isLiteral()) {
          const aparentType = unionType
            .getApparentType()
            .getText()
            .toLowerCase();

          switch (aparentType) {
            case "string":
              const str = unionType
                .getText()
                .replace(/(^("|'|`)|("|'|`)$)/g, "");
              return `string:${str}`;
            case "number":
              const num = unionType.getText();
              return `string:${num}`;
            default:
              return aparentType;
          }
        }

        switch (unionTypeName.toLowerCase()) {
          case "string":
          case "number":
          // case "bigint"
          case "boolean":
          case "null":
          case "undefined":
            // case "symbol":
            return unionTypeName;
        }

        // fall back to object
        if (node) {
          const properties = unionType.getProperties().map((t) => {
            return buildParamTypes(t.getTypeAtLocation(node), {
              name: `${name}.${t.getName()}`,
              key: t.getName(),
            });
          });
          const obj: ParamItem = {
            name,
            object: properties,
          };
          return obj;
        }

        // TODO: handle array type
      })
      .filter((value, index, array) => {
        return array.indexOf(value) === index;
      });

    const output: ParamItem = {
      name,
      key,
      types: types as ParamItem[],
    };

    return output;
  }

  const { cli } = await require(config.getJsEntry());
  let warning = false;

  for (const file in functions) {
    for (let fn of functions[file]) {
      const name = fn.getName();

      if (!name) {
        warning = true;
        console.warn(
          kleur.yellow("Warning: CLI functions must be named functions")
        );
        continue;
      }

      const [matchingFnExportName, matchingFn] =
        Object.entries(cli).find(([_, fn]: any) => fn.name === name) ?? [];

      if (!cli[name] && matchingFn !== undefined) {
        warning = true;
        console.warn(
          "\n" +
            kleur.yellow(dedent`
              Warning: CLI function exported name must match function definition name
  
              ${kleur.bold("Correct")}
              function ${name}() {}
  
              export const cli = {
                ${name},
              }
  
              ${kleur.bold("Incorrect")}
              function ${name}() {}
  
              export const cli = {
                // don't rename functions
                ${matchingFnExportName}: ${name}
              }
            `)
        );
        continue;
      }

      let description = fn.getJsDocs().at(0)?.getDescription() ?? "";
      if (description === "undefined") {
        description = "";
      }

      let params = [];

      for (const param of fn.getParameters()) {
        params.push(
          buildParamTypes(param.getType(), {
            node: param,
            name: param.getName(),
          })
        );
      }

      if (name) {
        definitions.push({
          params,
          description: dedent(description).replace("\n", " "),
          file: file.replace(/^\//, ""),
          name,
        });
      }
    }
  }

  if (warning) {
    // @ts-ignore
    detectingTypesspinner.success({ mark: kleur.yellow(symbols.tick) });
  } else {
    detectingTypesspinner.success();
  }

  const writingFileSpinner = createSpinner("Writing CLI data files").start();

  await fs.writeFile(
    path.join(config.getOutputDir(), "cli.json"),
    JSON.stringify(definitions, null, 2)
  );

  writingFileSpinner.success();
}

export async function build() {
  try {
    await fs.mkdir(config.getOutputDir(), { recursive: false });
  } catch (e) {}

  const tmpBuiltPath = `.${uuid()}.tmp.ts`;

  await buildTypeScript(tmpBuiltPath);
  await buildCli();
}

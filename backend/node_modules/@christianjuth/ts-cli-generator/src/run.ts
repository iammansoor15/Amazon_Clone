import dedent from "dedent";
// @ts-ignore
import * as getFn from "get-function-location";
import kleur from "kleur";
import path from "path";
import prompts from "prompts";
import { autocomplete } from "./autocomplete";
import { config, Data, ParamItem, setRoot } from "./config";
import { ParamsArrayPartial } from "./types";
import { camelCaseToHyphen, formatTable, hyphenToCamelCase } from "./utils";

const getFnLoc = getFn.default;

function padRight(str: string, length: number) {
  const padding = Math.max(length - str.length, 0);
  return `${str}${" ".repeat(padding)}`;
}

async function getValue(
  param: ParamItem,
  argQueue: any[],
  onCancel: () => any,
  cancledRef: { current: boolean }
): Promise<any> {
  if (cancledRef.current) {
    return;
  }

  if (param.object) {
    const obj: Record<string, any> = {};

    for (const prop of param.object) {
      if (prop.key) {
        obj[prop.key] = await getValue(prop, argQueue, onCancel, cancledRef);
      }
    }

    return obj;
  }

  let selectedType = "";

  if (param.types === undefined) {
    return;
  } else if (param.types.length > 1) {
    selectedType = (
      await prompts(
        {
          type: "autocomplete",
          name: "type",
          message: `Select praram type for ${param.name}`,
          choices: param.types.map((t) => {
            const value = typeof t === "string" ? t : t.name;
            let title = value;
            if (title.indexOf(":") !== -1) {
              const [_, literal] = title.split(":");
              title = literal;
            }
            return {
              title,
              value,
            };
          }),
        },
        { onCancel }
      )
    ).type;
  } else if (param.types.length === 1) {
    const firstType = param.types[0];
    selectedType = typeof firstType === "string" ? firstType : firstType.name;
  }

  // handle literals
  if (selectedType.indexOf(":") !== -1) {
    const [aparentType, literal] = selectedType.split(":");
    switch (aparentType) {
      case "string":
        return literal;
      case "number":
        return +literal;
    }
  }

  const hasArgument = argQueue.length > 0;
  const argument = argQueue.shift();

  const message = camelCaseToHyphen(param.name);

  switch (selectedType) {
    case "string":
      return (
        argument ??
        (
          await prompts(
            {
              type: "text",
              name: "value",
              message,
            },
            { onCancel }
          )
        ).value ??
        ""
      );
    case "number":
      const numVal =
        argument ??
        (
          await prompts(
            {
              type: "number",
              name: "value",
              message,
            },
            { onCancel }
          )
        ).value ??
        0;
      return +numVal;
    // case "bigint"
    case "boolean":
      const boolVal =
        argument ??
        (
          await prompts(
            {
              type: "select",
              name: "value",
              message,
              choices: [
                { value: "true", title: "True" },
                { value: "false", title: "False" },
              ],
            },
            { onCancel }
          )
        ).value;
      return boolVal === "true";
    case "null":
      return null;
    case "undefined":
      return undefined;
    // case "symbol":
  }

  if (hasArgument) {
    return argument;
  }

  for (const type of param.types) {
    if (typeof type !== "string" && type.name === selectedType) {
      return getValue(type, argQueue, onCancel, cancledRef);
    }
  }
}

function help({
  name,
  version,
  commands,
}: {
  name: string;
  version: string;
  commands: {
    name: string;
    description: string;
  }[];
}) {
  return console.log(
    dedent`
    ${kleur.gray(`${name} ${version}`)}

    ${kleur.bold("Usage:")} 
      $ ${name} <command>

    ${kleur.bold("Commands:")}
      ${formatTable(
        commands.map((c) => [c.name, c.description]),
        6
      )}

    ${kleur.bold("Other commands:")}
      ${formatTable(
        [
          ["help", "", "Output usage information"],
          ["autocomplete", "[enable|disable]", "Setup autocomplete"],
        ],
        6
      )}
  ` + "\n"
  );
}

let _dir = "";
let _functions: Record<string, (...args: any) => any> = {};

async function swallowErrors(fn: () => any, onCancel: () => any) {
  try {
    await fn();
  } catch (e: any) {
    if (e === "exit") {
      onCancel();
    } else if (e.message) {
      console.error(kleur.red(e.message));
    }
  }
}

async function getFunctionData(data: Data, fn: (...args: any) => any) {
  const normalize = (p: string) => p.replace(/(\/|\\)/, "-");

  try {
    const loc = (await getFnLoc(fn)).source;
    const file = loc
      .replace(config.getOutputDir(), "")
      .replace(/\.js$/, "")
      .replace("file:///", "");
    return data.filter((item) => {
      return item.name === fn.name && normalize(item.file) === normalize(file);
    })?.[0];
  } catch (e) {
    return undefined;
  }
}

export async function run<T extends string>(
  dir: string,
  functions: Record<T, (...args: any) => any>
) {
  setRoot(dir);
  autocomplete.listen(functions);
  _dir = dir;
  _functions = functions;

  const pkgJson = await config.getPkgJson();
  const data = await config.getDataFile();

  const flags = [];
  const args = process.argv.slice(2);

  // keep removing items until we encounter
  // something that isn't a flag
  while (args.length > 0) {
    const crnt = args[0];
    // is flag
    if (crnt && crnt[0] === "-") {
      flags.push(args.shift());
    } else {
      break;
    }
  }

  let functionName = args.shift() ?? "";
  if (functionName[0] === "_") {
    // disallow calling of hidden functions
    functionName = "";
  }

  if (functionName === "autocomplete") {
    if (args[0] === "disable") {
      await autocomplete.uninstall();
      return;
    } else {
      await autocomplete.setup();
      return;
    }
  }

  if (functionName === "help") {
    // empty command prints usage
    await runInternal(dir, functions, "");
    return;
  }

  // @ts-ignore
  await functions.__onStart__?.();

  if (!functionName) {
    console.log(kleur.gray(`Check usage by running "${pkgJson.name} help"`));
    while (true) {
      let helpText: any;

      const { command } = await prompts(
        {
          type: "autocomplete",
          name: "command",
          message: "",
          choices: [
            ...Object.keys(functions)
              .filter((name) => name[0] !== "_")
              .map((key) => ({
                title: camelCaseToHyphen(key),
                value: key,
              })),
          ],
          onState: async ({ value }) => {
            const d = await getFunctionData(
              data,
              functions[value as keyof typeof functions]
            );
            helpText = d ? d.description : "";
          },
          // @ts-ignore
          onRender() {
            // @ts-ignore
            this.msg = [
              "Select a command",
              helpText ? kleur.gray(`(${helpText})`) : null,
            ]
              .filter(Boolean)
              .join(" ");
          },
        },
        {
          onCancel: exit,
        }
      );
      await swallowErrors(
        async () => {
          await runInternal(dir, functions, command);
        },
        () => {
          console.log("Press CTRL-C again to exit");
        }
      );
    }
  }

  await swallowErrors(async () => {
    await runInternal(dir, functions, functionName);
  }, exit);
  exit();
}

export async function runInternal(
  dir: string,
  fns: Record<string, (...args: any) => any>,
  functionName: string,
  paramQueue: any[] = process.argv.slice(3)
) {
  let version = "unknown";
  let name = "untitled";

  const pkgJason = await config.getPkgJson();
  version = pkgJason.version ?? version;
  name = pkgJason.name ? pkgJason.name.replace(/@[^\/]+\//, "") : name;

  const data = await require(path.join(dir, "./cli.json"));

  const command = hyphenToCamelCase(functionName);

  // const fnConfig = data[command];
  const fn = fns[command];

  if (!command || !fn) {
    const commands = [];

    for (const [name, value] of Object.entries(fns).filter(
      ([name]) => name[0] !== "_"
    )) {
      const functionData = await getFunctionData(data, value);
      if (functionData) {
        commands.push({
          name: camelCaseToHyphen(name),
          description: functionData?.description ?? "",
        });
      } else {
        console.error(`failed to identify paramaters for function ${name}`);
      }
    }

    help({
      name: fns.__name__?.() ?? name,
      version: fns.__version__?.() ?? version,
      commands,
    });
  } else {
    await fns.__beforeFn__?.(fn);

    const fnConfig = await getFunctionData(data, fn);

    if (!fnConfig) {
      throw Error(`filed to idenfity params for ${fn.name}`);
    }

    let cancledRef = { current: false };
    function onCancel() {
      cancledRef.current = true;
      // thowing will cancel the current interaction
      throw "exit";
    }

    const params = [];
    for (const param of fnConfig.params) {
      if (cancledRef.current) {
        return;
      }
      params.push(await getValue(param, paramQueue, onCancel, cancledRef));
    }

    if (cancledRef.current) {
      return;
    }

    const output = await fn(...params);
    return output;
  }
}

export function call<Args extends any[], R>(fn: (...any: Args) => R) {
  return async (...params: ParamsArrayPartial<Args>): Promise<R> => {
    const name = fn.name;
    if (_dir && name) {
      return await runInternal(
        _dir,
        { ..._functions, [name]: fn },
        name,
        params
      );
    }
    throw Error(`Could not find function with name ${fn}`);
  };
}

function exit() {
  process.exit();
}

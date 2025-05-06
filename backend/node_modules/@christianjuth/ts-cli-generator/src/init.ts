import { promises as fs } from "fs";
import prompts from "prompts";
import path from "path";
import dedent from "dedent";
import { exec } from "child_process";
import kleur from "kleur";
import { config } from "./config";
import { createSpinner } from "nanospinner";

const CODE_BLOCK = "```";

export async function init() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter a name for your cli",
  });

  let indexData = dedent`
    import { CLI } from "@christianjuth/ts-cli-generator";

    /**
     * Add two numbers
     */
    function add(x: number, y: number) {
      console.log(x + y);
    }
    
    export const cli: CLI = {
      add,
    };
  `;

  let templateDeps = {};
  let templateDevDeps = {};

  try {
    const templates = (
      await fs.readdir(path.join(config.pkgRoot, "examples"))
    ).filter((name) => name[0] !== ".");

    const { template } = await prompts({
      type: "select",
      name: "template",
      message: "Pick a template",
      choices: templates.map((template) => ({
        title: template,
        value: template,
      })),
    });

    indexData = (
      await fs.readFile(
        path.join(config.pkgRoot, "examples", template, "index.ts")
      )
    ).toString();

    const { dependencies, devDependencies } = await require(path.join(
      config.pkgRoot,
      "examples",
      template,
      "package.json"
    ));
    templateDeps = dependencies;
    templateDevDeps = devDependencies;
  } catch (e) {}

  const creatingFilesSpinner = createSpinner("Creating project files").start();

  await fs.mkdir(name, { recursive: false });

  await fs.writeFile(path.join(name, "index.ts"), indexData);

  const pjson = {
    name,
    version: "0.0.0",
    main: "./.cli/cli.js",
    bin: "./.cli/cli.js",
    files: [".cli", "README.md"],
    scripts: {
      build: config.buildPackageExec,
      start: `${config.buildPackageExec} && node .`,
      dev: `nodemon -e ts --ignore *.tmp.ts -x '${config.buildPackageExec} && node . $1'`,
    },
    devDependencies: {
      ...templateDevDeps,
      nodemon: "2.x",
      "ts-morph": "13.x",
      typescript: "*",
    },
    dependencies: {
      ...templateDeps,
      [config.packageName]: "*",
    },
  };

  await fs.writeFile(
    path.join(name, "package.json"),
    JSON.stringify(pjson, null, 2)
  );

  await fs.writeFile(
    path.join(name, "README.md"),
    dedent`
      # ${name}

      ### Run CLI
      ${CODE_BLOCK}bash
        npm start
      ${CODE_BLOCK}

      ### Run with nodemon
      ${CODE_BLOCK}bash
        npm run dev
      ${CODE_BLOCK}

      ### Build
      ${CODE_BLOCK}bash
        npm run build
      ${CODE_BLOCK}

      ### Install CLI locally
      ${CODE_BLOCK}bash
        # (make sure you build before linking)
        npm link
        ${name}
      ${CODE_BLOCK}
    `
  );

  await fs.writeFile(
    path.join(name, ".gitignore"),
    dedent`
      # Logs
      logs
      *.log
      npm-debug.log*

      # Node
      node_modules/

      # Mac
      .DS_Store

      # Builds
      *.tmp.ts
    `
  );

  const tsConfig = {
    compilerOptions: {
      noImplicitAny: true,
      strict: true,
      lib: ["ESNext", "DOM"],
    },
    exclude: ["node_modules"],
  };

  await fs.writeFile(
    path.join(name, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
  );

  creatingFilesSpinner.success();

  const npmInstallSpinner = createSpinner(
    "Installing npm dependencies"
  ).start();

  exec(`npm install`, { cwd: name }, () => {
    npmInstallSpinner.success();

    console.log(
      "\n" +
        dedent`
          ${kleur.bold("Getting started")}
            # navigate to project
            ${kleur.green(`cd ${name}`)}
  
            # edit index.ts
  
          ${kleur.bold("Commands")}
            # Run CLI
            ${kleur.green("npm start")}

            # Run with nodemon
            ${kleur.green("npm run dev")}
  
            # Build
            ${kleur.green("npm run build")}
  
            # Install CLI locally
            # (make sure you build before linking)
            ${kleur.green("npm link")}
            ${kleur.green(name)} 
        ` +
        "\n"
    );

    exec("git init", { cwd: name });
  });
}

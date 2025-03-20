import omelette from "omelette";
import { config } from "./config";
import { camelCaseToHyphen, promiseExec, spinner } from "./utils";

async function createShortcuts(
  fns: Record<string, (...args: any) => any> = {}
) {
  const pkgJson = await config.getPkgJson();
  const data = await config.getDataFile();

  const commands = Object.values(fns)
    .filter((fn) => fn.name[0] !== "_")
    .map((fn) => camelCaseToHyphen(fn.name));
  const internalCommands = ["help", "autocomplete"];

  const complete = omelette(`${pkgJson.name} <command>`);

  complete.on("command", ({ reply }) => {
    reply([...commands, ...internalCommands]);
  });

  return complete;
}

async function listen(fns: Record<string, (...args: any) => any>) {
  const complete = await createShortcuts(fns);
  complete.init();
}

async function uninstall() {
  try {
    const complete = await createShortcuts();
    complete.cleanupShellInitFile();
  } catch (err) {
    console.log(err);
  }
}

async function install() {
  try {
    const complete = await createShortcuts();
    complete.setupShellInitFile();
  } catch (err) {
    console.log(err);
  }
}

async function setup() {
  const pkgJson = await config.getPkgJson();
  const name = pkgJson.name;

  await spinner({ name: "Updating shell config" }, async () => {
    if (name) {
      // cleanup any previous installation
      await promiseExec(`${name} autocomplete disable`);
    }
    install();
  });
}

export const autocomplete = {
  setup,
  uninstall,
  listen,
};

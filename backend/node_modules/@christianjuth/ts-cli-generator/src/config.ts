import findRoot from "find-root";
import path from "path";
import { Events } from "./types";

type ParamType = string | ParamItem;

export type ParamItem = {
  name: string;
  key?: string;
  index?: number;
  types?: ParamType[];
  object?: ParamItem[];
};

export type Data = {
  params: ParamItem[];
  description: string;
  file: string;
  name: string;
}[];

let _root = process.cwd();

export function setRoot(dir: string) {
  const r = findRoot(dir);
  _root = r;
}

export function getRoot() {
  return _root;
}

async function getPkgJson(): Promise<Record<string, any>> {
  const root = getRoot();
  try {
    return await require(path.join(root, "package.json"));
  } catch (e) {
    return {};
  }
}

async function getDataFile() {
  const root = getRoot();
  try {
    return (await require(path.join(root, ".cli", "cli.json"))) as Data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const ENTRY_NAME = "index";

let cliRoot = "";
try {
  cliRoot = findRoot(process.cwd());
} catch (e) {}

let pkgRoot = "";
try {
  pkgRoot = findRoot(__dirname);
} catch (e) {}

const INTERNAL_METHODS: (keyof Events)[] = [
  "__onStart__",
  "__version__",
  "__help__",
  "__beforeFn__",
];

export const config = {
  getOutputDir: () => path.join(_root, ".cli"),
  packageName: "@christianjuth/ts-cli-generator",
  buildPackageExec: "ts-cli-generator build",
  cliRoot,
  tsEntry: path.join(cliRoot, `${ENTRY_NAME}.ts`),
  getJsEntry: () => path.join(_root, ".cli", `${ENTRY_NAME}.js`),
  pkgRoot,
  internalMethods: INTERNAL_METHODS,
  getDataFile,
  getPkgJson,
};

import { exec } from "child_process";
import dedent from "dedent";
import { createSpinner } from "nanospinner";

// NOT CRYPTOGRAPHIC
const SEED = 5381;

// When we have separate strings it's useful to run a progressive
// version of djb2 where we pretend that we're still looping over
// the same string
const phash = (h: number, x: string) => {
  let i = x.length;

  while (i) {
    h = (h * 33) ^ x.charCodeAt(--i);
  }

  return h;
};

// This is a djb2 hashing function
export const hash = (x: string | Record<string, any> | any[]) => {
  let str = "";
  if (typeof x === "string") {
    str = x;
  } else {
    str = JSON.stringify(x);
  }
  return phash(SEED, str) + "";
};

function padRight(str: string, length: number) {
  const padding = Math.max(length - str.length, 0);
  return `${str}${" ".repeat(padding)}`;
}

export function formatTable(data: string[][], indent = 0) {
  const colWidths: number[] = [];

  for (const row of data) {
    for (let i = 0; i < row.length; i++) {
      colWidths[i] = Math.max(colWidths[i] ?? 0, row[i].length);
    }
  }

  let table = "";

  for (const row of data) {
    for (let i = 0; i < row.length; i++) {
      const col = row[i];
      if (i > 0) {
        table += "\t";
      }
      table += padRight(col, colWidths[i]);
    }
    table += "\n";
  }

  return dedent(table)
    .split("\n")
    .join(`\n${" ".repeat(indent)}`);
}

export function printTable(data: string[][]) {
  console.log(formatTable(data));
}

export const camelCaseToHyphen = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export const hyphenToCamelCase = (name: string) =>
  name.replace(/-./g, (m) => m[1].toUpperCase());

export async function spinner<T>(
  config: { name: string },
  fn: () => T
): Promise<T> {
  const spinner = createSpinner(config.name);
  const out = await fn();
  spinner.success();
  return out;
}

export const promiseExec = (command: string, cwd?: string) =>
  new Promise<string>((resolve, reject) => {
    exec(command, { cwd }, (error, stdout) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        resolve(dedent(stdout));
      }
    });
  });

# `@christianjuth/ts-cli-generator`

### Create a new CLI project

```bash
npx @christianjuth/ts-cli-generator
```



### Resources
* [Read my article on building a CLI](https://dev.to/christianjuth/turn-your-resume-into-an-interactive-cli-in-10-minutes-with-typescript-25fc)
* [Check out some examples](https://github.com/christianjuth/monorepo/tree/main/packages/ts-cli-generator/examples)

### Demo
![demo video](https://s10.gifyu.com/images/ezgif-2-2d9459aa6c.gif)

### How it works

The following `index.ts` file:

```typescript
import { call, CLI } from "@christianjuth/ts-cli-generator";

/**
 * Add two numbers
 */
function add(x: number, y: number) {
  console.log(x + y);
}

/**
 * Subtract two numbers
 */
function _subtract(x: number, y: number) {
  return x - y;
}

/**
 * Add then subtract as separate interactioins
 */
async function addSubtract(x: number, y: number) {
  console.log(x + y);
  // call allows you to call a cli function
  // from within another cli function
  console.log(await call(_subtract)());
}

/**
 * Get the length of a string
 */
function lengthOfString(str: string) {
  console.log(str.length);
}

export const cli: CLI = {
  add,
  addSubtract,
  lengthOfString,
  // underscore means function is available but hidden
  _subtract,
};

```

Will generate the following CLI:

```bash
name-of-cli CLI 0.0.0

Powered by @christianjuth/ts-cli-generator

Commands:
  add             	Add two numbers
  add-subtract    	Add then subtract as separate interactions
  length-of-string	Get the length of a string

Options:
  -i, --interactive	Run CLI in interactive mode
```

```bash
name-of-cli add
✔ param: x … 5
✔ param: y … 6
11
```

```bash
name-of-cli add-subtract
✔ param: x … 5
✔ param: y … 6
11
subtract
✔ param: x … 7
✔ param: y … 8
-1
```

```bash
name-of-cli length-of-string
✔ param: str … hello world
11
```
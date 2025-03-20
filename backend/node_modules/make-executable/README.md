<div align="center">
  <h1>make-executable</h1>
  <a href="https://npmjs.com/package/make-executable">
    <img alt="NPM" src="https://img.shields.io/npm/v/make-executable.svg">
  </a>
  <a href="https://github.com/bconnorwhite/make-executable">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/make-executable.svg">
  </a>
  <a href='https://coveralls.io/github/bconnorwhite/make-executable?branch=master'>
    <img alt="Coverage Status" src="https://img.shields.io/coveralls/github/bconnorwhite/make-executable.svg?branch=master">
  </a>
  <a href="https://github.com/bconnorwhite/make-executable">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/bconnorwhite/make-executable?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> Set the executable bits on a file.

## Installation

```sh
yarn add make-executable
```

```sh
npm install make-executable
```

## API

```ts
import { makeExecutable, makeExecutableSync } from "make-executable";

function makeExecutable(path: string): Promise<boolean | undefined>;

function makeExecutableSync(path: string): boolean | undefined;
```

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/make-executable.svg"></h2>

- [@bconnorwhite/bob](https://www.npmjs.com/package/@bconnorwhite/bob): Bob is a toolkit for TypeScript projects
- [@types/mock-fs](https://www.npmjs.com/package/@types/mock-fs): TypeScript definitions for mock-fs
- [@types/node](https://www.npmjs.com/package/@types/node): TypeScript definitions for Node.js
- [mock-fs](https://www.npmjs.com/package/mock-fs): A configurable mock file system.  You know, for testing.

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/make-executable.svg"></h2>

[MIT](https://opensource.org/licenses/MIT)

<br />

## Related Packages

- [fs-safe](https://www.npmjs.com/package/fs-safe): A simple fs wrapper that doesn't throw
- [read-file-safe](https://www.npmjs.com/package/read-file-safe): Read files without try catch
- [write-file-safe](https://www.npmjs.com/package/write-file-safe): Write files, and parent directories if necessary
- [remove-file-safe](https://www.npmjs.com/package/remove-file-safe): Remove a file without try catch
- [watch-file-safe](https://www.npmjs.com/package/watch-file-safe): Watch a file for changes

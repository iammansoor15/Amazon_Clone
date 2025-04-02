#!/usr/bin/env node
import { build } from "./build";
import { init } from "./init";

const arg = process.argv[2];

if (arg === "build") {
  build();
} else {
  init();
}

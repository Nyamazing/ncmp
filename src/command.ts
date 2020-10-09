#!/usr/bin/env node
const myPackage = require("../package.json");
import { ncmp, cmpResultDifferent } from './index';

const [, , ...args] = process.argv;

const version = `file-compare ${myPackage.version}`;
const usage = `Usage: file-compare [OPTION] FILE1 FILE2 [SKIP]`;
const message = `${version}

${usage}`;


const display = (s: string) => console.log(s);

type WouldBe<T> = { [P in keyof T]?: unknown }

function isObject<T extends object>(value: unknown): value is WouldBe<T> {
  return typeof value === 'object' &&
    value !== null
}
const isCmpResultDifferent = (a: unknown): a is cmpResultDifferent => {
  return isObject<cmpResultDifferent>(a) &&
    typeof a.same === 'boolean' && a.same === false &&
    (typeof a.char === 'number' || typeof a.char === 'undefined')
};

const execCmp = (file1: string, file2: string, offset: string | undefined) => {
  const hasOffset = !Number.isNaN(Number(offset));
  const exec = hasOffset ? ncmp(file1, file2, Number(offset)) : ncmp(file1, file2);
  exec.then(() => process.exit(0)).catch(result => {
    if (isCmpResultDifferent(result)) {
      const append = result.char !== undefined ? ` differ: char ${result.char}` : '';
      display(`${args[0]} ${args[1]}${append}`);
      process.exit(64);
    } else {
      display(String(result));
      process.exit(65);
    }
  });
};

if (args.length === 0) {
  display(message);
} else if (args[0] === '-v' || args[0] === '--version') {
  display(version);
} else if (args[0] === '-h' || args[0] === '--help') {
  display(usage);
} else if (args.length === 1) {
  display(`Expect at least 2 arguments.`);
} else {
  execCmp(args[0], args[1], args[2]);
}

process.on('uncaughtException', err => {
  display(String(err));
  process.exit(65);
});
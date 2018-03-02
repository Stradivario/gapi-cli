#! /usr/bin/env node
var shell = require("shelljs");


shell.exec(
    `nodemon --verbose --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec 'ts-node' ${process.cwd()}/src/main.ts`
);

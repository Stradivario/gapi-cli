#! /usr/bin/env node
var shell = require("shelljs");

shell.exec(`${process.argv[0]} ${__dirname}/tasks/${process.argv[2]}.js ${process.argv[3]}`);
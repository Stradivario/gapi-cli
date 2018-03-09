#! /usr/bin/env node

var shell = require("shelljs");
if (process.argv[2] === 'build') {
    shell.exec(
        `docker build -t ${process.argv[3]} ${process.cwd()}`
    );
}

if (process.argv[2] === 'start') {
    shell.exec(
        `docker-compose up --force-recreate`
    );
}
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });
if (process.argv[2] === 'stop') {
    shell.exec(
        `docker stop ${process.argv[3]}`
    );
}


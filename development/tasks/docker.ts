#! /usr/bin/env node

import { exec } from 'shelljs';

if (process.argv[2] === 'build') {
    exec(
        `docker build -t ${process.argv[3]} ${process.cwd()}`
    );
}

if (process.argv[2] === 'start') {
    exec(
        `docker-compose up --force-recreate`
    );
}
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

if (process.argv[2] === 'stop') {
    exec(
        `docker stop ${process.argv[3]}`
    );
}


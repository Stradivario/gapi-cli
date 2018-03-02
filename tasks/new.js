#! /usr/bin/env node
var shell = require("shelljs");

shell.exec(
    `git clone https://github.com/Stradivario/gapi-starter.git ${process.argv[2]} && cd ./${process.argv[2]} && npm install`,
    function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      }
);

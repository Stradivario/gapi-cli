#! /usr/bin/env node
import { exec } from 'shelljs';

exec(
    `git clone https://github.com/Stradivario/gapi-starter.git ${process.argv[2]} && cd ./${process.argv[2]} && npm install`);

#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const root_service_1 = require("./core/services/root.service");
const args_service_1 = require("./core/services/args.service");
const config_service_1 = require("./core/services/config.service");
const yamljs_1 = require("yamljs");
const chalk = require("chalk");
const figlet = require("figlet");
const rootService = typedi_1.Container.get(root_service_1.RootService);
const argsService = typedi_1.Container.get(args_service_1.ArgsService);
const configService = typedi_1.Container.get(config_service_1.ConfigService);
let config = {};
try {
    config = yamljs_1.load('gapi-cli.conf.yml');
}
catch (e) {
    console.error('Missing gapi-cli.conf.yml gapi-cli will be with malfunctioning.');
}
configService.setCustomConfig(config);
argsService.setArguments(process.argv);
rootService.runTask()
    .then()
    .catch(e => console.error(e));
console.log(chalk.default.yellow(figlet.textSync('Gapi', { horizontalLayout: 'full' })));

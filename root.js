#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const root_service_1 = require("./core/services/root.service");
const args_service_1 = require("./core/services/args.service");
const config_service_1 = require("./core/services/config.service");
const fs_1 = require("fs");
const rootService = typedi_1.Container.get(root_service_1.RootService);
const argsService = typedi_1.Container.get(args_service_1.ArgsService);
const configService = typedi_1.Container.get(config_service_1.ConfigService);
const config = fs_1.readFileSync(`${process.cwd()}/gapi-cli.conf.json`, 'utf8');
argsService.setArguments(process.argv);
configService.setCustomConfig(JSON.parse(config));
rootService.runTask();

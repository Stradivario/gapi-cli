#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const root_service_1 = require("./core/services/root.service");
const args_service_1 = require("./core/services/args.service");
const rootService = typedi_1.Container.get(root_service_1.RootService);
const argsService = typedi_1.Container.get(args_service_1.ArgsService);
argsService.setArguments(process.argv);
rootService.runTask();

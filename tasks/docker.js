#! /usr/bin/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const typedi_1 = require("typedi");
const args_service_1 = require("../core/services/args.service");
const config_service_1 = require("../core/services/config.service");
let DockerTask = class DockerTask {
    constructor() {
        this.argsService = typedi_1.default.get(args_service_1.ArgsService);
        this.configService = typedi_1.default.get(config_service_1.ConfigService);
    }
    run() {
        if (this.argsService.args[3] === 'build') {
            shelljs_1.exec(this.configService.config.commands.docker.build);
        }
        if (this.argsService.args[3] === 'start') {
            console.log(this.configService.config.commands.docker);
            shelljs_1.exec(this.configService.config.commands.docker.start);
        }
        if (this.argsService.args[3] === 'stop') {
            shelljs_1.exec(this.configService.config.commands.docker.stop);
        }
    }
    exec(command) {
        shelljs_1.exec(command);
    }
};
DockerTask = __decorate([
    typedi_1.Service()
], DockerTask);
exports.DockerTask = DockerTask;

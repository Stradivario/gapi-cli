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
let StartTask = class StartTask {
    constructor() {
        this.argsService = typedi_1.default.get(args_service_1.ArgsService);
    }
    run(stop = {}) {
        if (this.argsService.args.toString().includes('--prod')) {
            if (this.argsService.args.toString().includes('--docker')) {
                shelljs_1.exec(`pm2-docker process.yml --only APP`);
            }
            else {
                if (!stop.state) {
                    shelljs_1.exec(`pm2 stop process.yml`);
                }
                else {
                    shelljs_1.exec(`pm2 start process.yml --only APP`);
                }
            }
        }
        else {
            shelljs_1.exec(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec 'ts-node' ${process.cwd()}/src/main.ts --verbose`);
        }
    }
};
StartTask = __decorate([
    typedi_1.Service()
], StartTask);
exports.StartTask = StartTask;

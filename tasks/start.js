#! /usr/bin/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const args_service_1 = require("../core/services/args.service");
const config_service_1 = require("../core/services/config.service");
const environment_service_1 = require("../core/services/environment.service");
const exec_service_1 = require("../core/services/exec.service");
let StartTask = class StartTask {
    constructor() {
        this.argsService = typedi_1.Container.get(args_service_1.ArgsService);
        this.configService = typedi_1.Container.get(config_service_1.ConfigService);
        this.environmentService = typedi_1.Container.get(environment_service_1.EnvironmentVariableService);
        this.execService = typedi_1.Container.get(exec_service_1.ExecService);
        this.verbose = '';
    }
    run(stop = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.argsService.args.includes('--verbose')) {
                this.verbose = ' --verbose';
            }
            if (this.argsService.args.toString().includes('--prod')) {
                this.config = this.environmentService.setVariables(this.configService.config.config.app.prod);
                if (this.argsService.args.toString().includes('--docker')) {
                    yield this.execService.call(`${this.config} && pm2-docker process.yml --only APP`);
                }
                else {
                    console.log(stop.state, 'dada');
                    if (!stop.state) {
                        console.log('1');
                        yield this.execService.call(`${this.config} && pm2 stop process.yml`);
                    }
                    else {
                        console.log('2');
                        yield this.execService.call(`${this.config} && pm2 start process.yml --only APP`);
                    }
                }
            }
            else {
                this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
                yield this.execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${this.configService.config.config.schema.introspectionOutputFolder}/' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec '${this.config} && npm run lint && ts-node' ${process.cwd()}/src/main.ts ${this.verbose}`);
            }
        });
    }
};
StartTask = __decorate([
    typedi_1.Service()
], StartTask);
exports.StartTask = StartTask;

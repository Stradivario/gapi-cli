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
const shelljs_1 = require("shelljs");
const typedi_1 = require("typedi");
const args_service_1 = require("../core/services/args.service");
const config_service_1 = require("../core/services/config.service");
const start_1 = require("./start");
let ExecService = class ExecService {
    call(command, options) {
        return new Promise((resolve, reject) => {
            shelljs_1.exec(command, options, (e) => {
                if (e) {
                    reject(e);
                }
                resolve();
            });
        });
    }
};
ExecService = __decorate([
    typedi_1.Service()
], ExecService);
exports.ExecService = ExecService;
const execService = typedi_1.default.get(ExecService);
let TestTask = class TestTask {
    constructor() {
        this.argsService = typedi_1.default.get(args_service_1.ArgsService);
        this.configService = typedi_1.default.get(config_service_1.ConfigService);
        this.startTask = typedi_1.default.get(start_1.StartTask);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.args = this.argsService.args.toString();
            this.setConfig();
            this.setSleep();
            if (this.args.includes('--before')) {
                this.config += `&& export BEFORE_HOOK=true`;
                try {
                    yield execService.call(`${this.config} && ts-node ${process.cwd()}/src/test.ts`);
                }
                catch (e) {
                    console.error(`ERROR: Terminal exited with STATUS ${e} tests will not be runned check src/test.ts, appropriate exit code is 0`);
                    process.exit(1);
                }
                yield execService.call(`${this.config} && jest`);
                console.log('SUCCESS');
            }
            else {
                if (this.args.includes('--watch')) {
                    try {
                        yield execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' --exec '${this.config} && npm run lint && jest' --verbose`, { async: true });
                        // this.startTask.run();
                        // await execService.call(`${this.config} && jest --watchAll`);
                    }
                    catch (e) {
                        process.exit(1);
                    }
                }
                else {
                    try {
                        yield execService.call(`${this.config} && npm run lint && jest`);
                    }
                    catch (e) {
                        process.exit(1);
                    }
                }
                console.log('SUCCESS');
            }
        });
    }
    setSleep() {
        this.config += ` && sleep 0 `;
    }
    setVariables(config) {
        this.config = ``;
        const conf = Object.keys(config);
        let count = 0;
        conf.forEach((key) => {
            count++;
            if (conf.length === count) {
                this.config += `export ${key}=${config[key]}`;
            }
            else {
                this.config += `export ${key}=${config[key]} && `;
            }
        });
    }
    setConfig() {
        if (this.args.includes('--worker')) {
            this.setVariables(this.configService.config.config.test.worker);
        }
        else {
            this.setVariables(this.configService.config.config.test.local);
        }
        console.log(this.config);
    }
    validateConfig(key) {
        if (!this.configService.config.config.test[key]) {
            throw new Error('Missing test config inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_host) {
            throw new Error('Missing variable db_host inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_name) {
            throw new Error('Missing variable db_name inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_pass) {
            throw new Error('Missing variable db_password inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_port) {
            throw new Error('Missing variable db_port inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_user) {
            throw new Error('Missing variable db_user inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].endpoint) {
            throw new Error('Missing variable endpoint inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].token) {
            throw new Error('Missing variable token inside gapi-cli.conf.yml');
        }
    }
};
TestTask = __decorate([
    typedi_1.Service()
], TestTask);
exports.TestTask = TestTask;

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
const core_1 = require("@rxdi/core");
const shelljs_1 = require("shelljs");
const start_1 = require("../../tasks/start");
const args_service_1 = require("../services/args.service");
const new_1 = require("../../tasks/new");
const config_service_1 = require("./config.service");
const test_1 = require("../../tasks/test");
const schema_1 = require("../../tasks/schema");
const deploy_1 = require("../../tasks/deploy");
const build_1 = require("../../tasks/build");
const daemon_1 = require("../../tasks/daemon");
const generate_1 = require("../../tasks/generate/generate");
const bootstrap_1 = require("../../tasks/bootstrap");
const helpers_1 = require("../helpers");
const argsService = core_1.Container.get(args_service_1.ArgsService);
let RootService = class RootService {
    constructor() {
        this.startTask = core_1.Container.get(start_1.StartTask);
        this.newTask = core_1.Container.get(new_1.NewTask);
        this.testTask = core_1.Container.get(test_1.TestTask);
        this.configService = core_1.Container.get(config_service_1.ConfigService);
        this.schemaTask = core_1.Container.get(schema_1.SchemaTask);
        this.deployTask = core_1.Container.get(deploy_1.DeployTask);
        this.buildTask = core_1.Container.get(build_1.BuildTask);
        this.generateTask = core_1.Container.get(generate_1.GenerateTask);
        this.daemonTask = core_1.Container.get(daemon_1.DaemonTask);
        this.bootstrapTask = core_1.Container.get(bootstrap_1.BootstrapTask);
    }
    checkForCustomTasks() {
        return new Promise((resolve, reject) => {
            const commands = this.configService.config.commands;
            const filteredCommands = Object.keys(commands).filter(cmd => {
                if (cmd === argsService.args[2]) {
                    if (commands[cmd][argsService.args[3]]) {
                        if (commands[cmd][argsService.args[3]].constructor === Array) {
                            let count = 0;
                            const commandsArray = commands[cmd][argsService.args[3]];
                            const commandsToExecute = commandsArray.map(res => {
                                count++;
                                let item;
                                if (count === commandsArray.length) {
                                    return (item = res);
                                }
                                else {
                                    return res + ' && ';
                                }
                            });
                            const finalCommand = commandsToExecute
                                .toString()
                                .replace(/[, ]+/g, ' ')
                                .trim();
                            resolve(shelljs_1.exec(finalCommand));
                        }
                        else {
                            resolve(shelljs_1.exec(commands[cmd][argsService.args[3]]));
                        }
                        return true;
                    }
                    else {
                        reject(`Missing custom command ${argsService.args[3]}`);
                    }
                }
            });
            if (!filteredCommands.length) {
                reject('There are no tasks related with your command!');
            }
        });
    }
    runTask() {
        return __awaiter(this, void 0, void 0, function* () {
            if (argsService.args[2] === 'stop') {
                return yield this.startTask.run({ state: false });
            }
            if (argsService.args[2] === 'start') {
                return yield this.startTask.run({ state: true });
            }
            if (argsService.args[2] === 'build') {
                return yield this.buildTask.run();
            }
            if (argsService.args[2] === 'new') {
                return yield this.newTask.run();
            }
            if (argsService.args[2] === 'test') {
                return yield this.testTask.run();
            }
            if (argsService.args[2] === 'schema') {
                const introspectionEndpoint = helpers_1.nextOrDefault('--url', '');
                const introspectionFolder = helpers_1.nextOrDefault('--folder', '');
                const pattern = helpers_1.nextOrDefault('--pattern', '');
                return yield this.schemaTask.run(introspectionEndpoint, introspectionFolder, pattern);
            }
            if (argsService.args[2] === 'deploy') {
                return yield this.deployTask.run();
            }
            if (argsService.args[2] === 'generate' || argsService.args[2] === 'g') {
                return yield this.generateTask.run();
            }
            if (argsService.args[2] === 'daemon' || argsService.args[2] === 'd') {
                return yield this.daemonTask.run();
            }
            if (argsService.args[2] === 'bootstrap' || argsService.args[2] === 'b') {
                return yield this.bootstrapTask.run();
            }
            try {
                yield this.checkForCustomTasks();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
};
RootService = __decorate([
    core_1.Service()
], RootService);
exports.RootService = RootService;

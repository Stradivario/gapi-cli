"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const shelljs_1 = require("shelljs");
const start_1 = require("../../tasks/start");
const args_service_1 = require("../services/args.service");
const new_1 = require("../../tasks/new");
const docker_1 = require("../../tasks/docker");
const rxjs_1 = require("rxjs");
const config_service_1 = require("./config.service");
const argsService = typedi_1.Container.get(args_service_1.ArgsService);
let RootService = class RootService {
    constructor() {
        this.startTask = typedi_1.Container.get(start_1.StartTask);
        this.newTask = typedi_1.Container.get(new_1.NewTask);
        this.dockerTask = typedi_1.Container.get(docker_1.DockerTask);
        this.configService = typedi_1.Container.get(config_service_1.ConfigService);
    }
    checkForCustomTasks() {
        return rxjs_1.Observable.create(observer => {
            const commands = this.configService.config.commands;
            const filteredCommands = Object.keys(commands)
                .filter(cmd => {
                if (cmd === argsService.args[2]) {
                    if (commands[cmd][argsService.args[3]]) {
                        observer.next(shelljs_1.exec(commands[cmd][argsService.args[3]]));
                        return true;
                    }
                    else {
                        observer.error(`Missing custom command ${argsService.args[3]}`);
                    }
                }
            });
            if (!filteredCommands.length) {
                observer.error('There are no tasks related with your command!');
            }
        });
    }
    runTask() {
        if (argsService.args[2] === 'stop') {
            return this.startTask.run({ state: false });
        }
        if (argsService.args[2] === 'start') {
            return this.startTask.run();
        }
        if (argsService.args[2] === 'new') {
            return this.newTask.run();
        }
        this.checkForCustomTasks()
            .subscribe(() => { }, (e) => {
            console.log(e);
        });
    }
};
RootService = __decorate([
    typedi_1.Service()
], RootService);
exports.RootService = RootService;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const start_1 = require("../../tasks/start");
const args_service_1 = require("../services/args.service");
const new_1 = require("../../tasks/new");
const docker_1 = require("../../tasks/docker");
const argsService = typedi_1.Container.get(args_service_1.ArgsService);
let RootService = class RootService {
    constructor() {
        this.startTask = typedi_1.Container.get(start_1.StartTask);
        this.newTask = typedi_1.Container.get(new_1.NewTask);
        this.dockerTask = typedi_1.Container.get(docker_1.DockerTask);
    }
    runTask() {
        this.start();
        this.newT();
        this.docker();
    }
    iterateOverTasks() {
        const descriptors = Object.getOwnPropertyDescriptors(this);
        Object.keys(descriptors).forEach(desc => {
            descriptors[desc];
        });
    }
    start() {
        argsService.findArgument('start').subscribe(() => this.startTask.run());
    }
    newT() {
        argsService.findArgument('new').subscribe(() => this.newTask.run());
    }
    docker() {
        argsService.findArgument('docker').subscribe(() => this.dockerTask.run());
    }
};
RootService = __decorate([
    typedi_1.Service()
], RootService);
exports.RootService = RootService;

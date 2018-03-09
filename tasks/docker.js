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
const rxjs_1 = require("rxjs");
let DockerTask = class DockerTask {
    constructor() {
        this.argsService = typedi_1.default.get(args_service_1.ArgsService);
    }
    run() {
        rxjs_1.Observable.from(this.argsService.args)
            .map(arg => {
            this.args += arg;
            if (arg === 'build') {
                this.build();
            }
            if (arg === 'start') {
                this.start();
            }
            if (arg === 'stop') {
                this.stop();
            }
            return arg;
        })
            .subscribe();
    }
    exec() {
        shelljs_1.exec(`git clone https://github.com/Stradivario/gapi-starter.git ${process.argv[2]} && cd ./${process.argv[2]} && npm install`);
    }
    start() {
        shelljs_1.exec(`docker-compose up --force-recreate`);
    }
    stop() {
        shelljs_1.exec(`docker stop ${process.argv[3]}`);
    }
    build() {
        shelljs_1.exec(`docker build -t ${process.argv[3]} ${process.cwd()}`);
    }
};
DockerTask = __decorate([
    typedi_1.Service()
], DockerTask);
exports.DockerTask = DockerTask;

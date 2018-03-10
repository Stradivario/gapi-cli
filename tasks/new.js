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
let NewTask = class NewTask {
    constructor() {
        this.argsService = typedi_1.default.get(args_service_1.ArgsService);
        this.repoLinks = {
            basic: 'https://github.com/Stradivario/gapi-starter',
            advanced: 'https://github.com/Stradivario/gapi-starter-postgres-sequelize'
        };
    }
    run() {
        if (this.argsService.args.toString().includes('--advanced')) {
            this.exec(this.repoLinks.advanced);
        }
        else {
            this.exec(this.repoLinks.basic);
        }
    }
    exec(repoLink) {
        shelljs_1.exec(`git clone ${repoLink} ${process.argv[3]} && cd ./${process.argv[3]} && npm install`);
    }
};
NewTask = __decorate([
    typedi_1.Service()
], NewTask);
exports.NewTask = NewTask;

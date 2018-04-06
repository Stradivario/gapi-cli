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
const exec_service_1 = require("../core/services/exec.service");
let NewTask = class NewTask {
    constructor() {
        this.execService = typedi_1.Container.get(exec_service_1.ExecService);
        this.argsService = typedi_1.Container.get(args_service_1.ArgsService);
        this.repoLinks = {
            basic: 'https://github.com/Stradivario/gapi-starter',
            advanced: 'https://github.com/Stradivario/gapi-starter-postgres-sequelize',
            microservices: 'https://github.com/Stradivario/gapi-starter-microservices'
        };
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.argsService.args.toString().includes('--advanced')) {
                yield this.exec(this.repoLinks.advanced);
            }
            else if (this.argsService.args.toString().includes('--microservices')) {
                yield this.exec(this.repoLinks.microservices);
            }
            else {
                yield this.exec(this.repoLinks.basic, 'echo basic example uses ts-node and gapi-cli installed internally because of Heroku easy deployment button. To uninstall ts-node and gapi-cli type "npm uninstall ts-node gapi-cli"');
            }
        });
    }
    exec(repoLink, args = '') {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execService.call(`git clone ${repoLink} ${process.argv[3]} && cd ./${process.argv[3]} && npm install ${args ? `&& ${args}` : ''}`);
        });
    }
};
NewTask = __decorate([
    typedi_1.Service()
], NewTask);
exports.NewTask = NewTask;

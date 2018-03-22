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
const config_service_1 = require("../core/services/config.service");
const readline_service_1 = require("../core/services/readline.service");
const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.QuestionsType = strEnum([
    'username',
    'password',
    'project'
]);
class UserConfig {
}
let DeployTask = class DeployTask {
    constructor() {
        this.execService = typedi_1.Container.get(exec_service_1.ExecService);
        this.argsService = typedi_1.Container.get(args_service_1.ArgsService);
        this.configService = typedi_1.Container.get(config_service_1.ConfigService);
        this.readlineService = typedi_1.Container.get(readline_service_1.ReadlineService);
        this.deploy_config = new UserConfig();
        this.spinner = new Spinner();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.spinner.setSpinnerString(17);
            try {
                yield this.usernameQuestion();
                yield this.passwordQuestion();
                yield this.projectQuestion();
                console.log('Deploy Success!');
            }
            catch (e) {
                console.log('Deploy Error!');
            }
            process.exit(0);
        });
    }
    passwordQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readlineService.createQuestion('Password: ', this.passwordTask.bind(this));
            yield this.validateUserConfig(exports.QuestionsType.password);
        });
    }
    projectQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readlineService.createQuestion('Project name: ', this.projectTask.bind(this));
            yield this.validateUserConfig(exports.QuestionsType.project);
        });
    }
    usernameQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readlineService.createQuestion('Username: ', this.usernameTask.bind(this));
            yield this.validateUserConfig(exports.QuestionsType.username);
        });
    }
    usernameTask(username) {
        this.deploy_config.username = username;
    }
    projectTask(name) {
        this.deploy_config.project = name;
    }
    passwordTask(password) {
        this.deploy_config.password = password;
    }
    validateUserConfig(question) {
        return __awaiter(this, void 0, void 0, function* () {
            process.stdout.write(`\x1B[2J`);
            process.stdout.write(`Current configuration: ${JSON.stringify(this.deploy_config, null, 4)} \n\n\n\n\n`);
            if (!this.deploy_config[question]) {
                console.log(chalk.red(`Missing ${question} please fill your ${question}!`));
                yield this[`${question}Question`]();
                yield this.validateUserConfig(question);
            }
        });
    }
};
DeployTask = __decorate([
    typedi_1.Service()
], DeployTask);
exports.DeployTask = DeployTask;

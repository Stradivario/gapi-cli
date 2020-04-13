"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const args_service_1 = require("../core/services/args.service");
const config_service_1 = require("../core/services/config.service");
const exec_service_1 = require("../core/services/exec.service");
const environment_service_1 = require("../core/services/environment.service");
let TestTask = class TestTask {
    constructor() {
        this.execService = core_1.Container.get(exec_service_1.ExecService);
        this.argsService = core_1.Container.get(args_service_1.ArgsService);
        this.configService = core_1.Container.get(config_service_1.ConfigService);
        this.environmentService = core_1.Container.get(environment_service_1.EnvironmentVariableService);
        this.config = ``;
        this.verbose = '';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.args = this.argsService.args.toString();
            this.setConfig();
            this.setSleep();
            if (this.args.includes('--verbose')) {
                this.verbose = ' --verbose';
            }
            console.log(this.config);
            if (this.args.includes('--before')) {
                this.config += `&& export BEFORE_HOOK=true`;
                try {
                    yield this.execService.call(`${this.config} && ts-node ${process.cwd()}/src/test.ts`);
                }
                catch (e) {
                    console.error(`ERROR: Terminal exited with STATUS ${e} tests will not be runned check ${process.argv[4] ? process.argv[4] : '/src/test.ts'}, appropriate exit code is 0`);
                    process.exit(1);
                }
                yield this.execService.call(`${this.config} && jest`);
                console.log('SUCCESS');
            }
            else {
                if (this.args.includes('--watch')) {
                    try {
                        yield this.execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${this.configService.config.config.schema.introspectionOutputFolder}/' --exec '${this.config} && npm run lint && jest' ${this.verbose}`, { async: true });
                        // this.startTask.run();
                        // await execService.call(`${this.config} && jest --watchAll`);
                    }
                    catch (e) {
                        process.exit(1);
                    }
                }
                else {
                    try {
                        yield this.execService.call(`${this.config} && npm run lint && jest`);
                    }
                    catch (e) {
                        return process.exit(1);
                    }
                }
                console.log('SUCCESS');
            }
        });
    }
    setSleep() {
        this.config += `&& sleep 0`;
    }
    setConfig() {
        if (this.argsService.args[3]) {
            const currentConfigKey = this.argsService.args[3].replace('--', '');
            const currentConfiguration = this.configService.config.config.test[currentConfigKey];
            if (currentConfiguration) {
                this.extendOrDefault(currentConfiguration);
                console.log(`'${currentConfigKey}' configuration loaded!`);
            }
            else {
                if (currentConfigKey !== 'watch' && currentConfigKey !== 'before') {
                    console.log(`Missing '${currentConfigKey}' argument configuration inside gapi-cli.conf.yml > config > test switching to 'local' configuration.`);
                }
                this.extendOrDefault(this.configService.config.config.test.local);
            }
        }
        else {
            this.extendOrDefault(this.configService.config.config.test.local);
        }
    }
    extendOrDefault(currentConfiguration) {
        if (currentConfiguration.constructor === String &&
            currentConfiguration.includes('extends')) {
            this.config = this.environmentService.setVariables(this.extendConfig(currentConfiguration));
        }
        else {
            this.config = this.environmentService.setVariables(currentConfiguration);
        }
    }
    extendConfig(config) {
        const splitted = config.split(' ');
        const argum = splitted[1].split('/');
        const extendedConfiguration = this.configService.config.config[argum[0]][argum[1]];
        if (!extendedConfiguration) {
            throw new Error(`Cannot extend current configuration ${config}`);
        }
        return extendedConfiguration;
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
    core_1.Service()
], TestTask);
exports.TestTask = TestTask;

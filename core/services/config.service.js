"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
class MainConfig {
}
exports.MainConfig = MainConfig;
class Commands {
}
exports.Commands = Commands;
class GapiConfig extends Commands {
}
exports.GapiConfig = GapiConfig;
let ConfigService = class ConfigService {
    constructor() {
        this.config = new GapiConfig();
    }
    setCustomConfig(config) {
        Object.assign(this.config, config);
        if (!config) {
            config = {};
        }
        if (!config.commands) {
            config.commands = {};
        }
        else {
            if (config.commands['test']) {
                this.genericError('test');
            }
            if (config.commands['new']) {
                this.genericError('new');
            }
            if (config.commands['schema']) {
                this.genericError('schema');
            }
            if (config.commands['start']) {
                this.genericError('start');
            }
            if (config.commands['stop']) {
                this.genericError('stop');
            }
        }
        this.config = config;
        this.config.config = this.config.config || {};
        this.config.config.schema = this.config.config.schema || {
            introspectionEndpoint: '',
            introspectionOutputFolder: '',
            pattern: ''
        };
    }
    genericError(command) {
        throw new Error(`You cannot define command "${command}" they are restricted!`);
    }
};
ConfigService = __decorate([
    core_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;

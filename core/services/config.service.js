"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ConfigService = class ConfigService {
    setCustomConfig(config) {
        if (config.commands['test']) {
            throw new Error('You cannot define command "test" they are restricted!');
        }
        if (config.commands['new']) {
            throw new Error('You cannot define command "new" they are restricted!');
        }
        this.config = config;
    }
};
ConfigService = __decorate([
    typedi_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;

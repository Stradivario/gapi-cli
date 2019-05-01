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
const config_service_1 = require("../core/services/config.service");
const fs_1 = require("fs");
const start_1 = require("./start");
let BuildTask = class BuildTask {
    constructor() {
        this.startTask = typedi_1.Container.get(start_1.StartTask);
        this.configService = typedi_1.Container.get(config_service_1.ConfigService);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const cwd = process.cwd();
            const customPath = process.argv[4]
                ? process.argv[4].split("--path=")[1]
                : null;
            const customPathExists = fs_1.existsSync(`${cwd}/${customPath}`);
            this.startTask.prepareBundler(`${customPathExists
                ? `${cwd}/${customPathExists ? customPath : "index.ts"}`
                : `${cwd}/src/main.ts`}`, {
                original: this.configService.config.config.app.local,
                schema: this.configService.config.config.schema
            });
        });
    }
};
BuildTask = __decorate([
    typedi_1.Service()
], BuildTask);
exports.BuildTask = BuildTask;

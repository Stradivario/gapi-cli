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
const core_1 = require("@rxdi/core");
const config_service_1 = require("../core/services/config.service");
const fs_1 = require("fs");
const start_1 = require("./start");
const util_1 = require("util");
const helpers_1 = require("../core/helpers");
let BuildTask = class BuildTask {
    constructor() {
        this.startTask = core_1.Container.get(start_1.StartTask);
        this.configService = core_1.Container.get(config_service_1.ConfigService);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const cwd = process.cwd();
            const customPath = process.argv[4]
                ? process.argv[4].split('--path=')[1]
                : null;
            const customPathExists = yield util_1.promisify(fs_1.exists)(`${cwd}/${customPath}`);
            const globPaths = helpers_1.nextOrDefault('--glob', '').split(',').filter((i) => !!i).map(f => `.${f}`);
            if (globPaths.length) {
                return yield this.startTask.prepareBundler(globPaths, {
                    original: this.configService.config.config.app.local,
                    schema: this.configService.config.config.schema
                });
            }
            yield this.startTask.prepareBundler(`${customPathExists
                ? `${cwd}/${customPathExists ? customPath : 'index.ts'}`
                : `${cwd}/src/main.ts`}`, {
                original: this.configService.config.config.app.local,
                schema: this.configService.config.config.schema
            });
        });
    }
};
BuildTask = __decorate([
    core_1.Service()
], BuildTask);
exports.BuildTask = BuildTask;

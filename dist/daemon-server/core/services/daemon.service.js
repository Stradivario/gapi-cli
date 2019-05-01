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
const fs_1 = require("fs");
const util_1 = require("util");
const child_process_1 = require("child_process");
let DaemonService = class DaemonService {
    trigger(payload) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
            const args = [
                'schema',
                'introspect',
                '--collect-documents',
                '--collect-types'
            ];
            if (!(yield util_1.promisify(fs_1.exists)(gapiLocalConfig))) {
                yield this.writeGapiCliConfig(gapiLocalConfig);
            }
            const child = child_process_1.spawn('gapi', args, { cwd: payload.repoPath });
            child.stdout.on('data', data => process.stdout.write(data));
            child.stderr.on('data', data => process.stderr.write(data));
            child.on('close', code => {
                if (!code) {
                    resolve(payload);
                }
                else {
                    reject(payload);
                }
            });
        }));
    }
    writeGapiCliConfig(gapiLocalConfig) {
        return util_1.promisify(fs_1.writeFile)(gapiLocalConfig, `
config:
schema:
  introspectionEndpoint: http://localhost:9000/graphql
  introspectionOutputFolder: ./api-introspection
`);
    }
};
DaemonService = __decorate([
    core_1.Service()
], DaemonService);
exports.DaemonService = DaemonService;

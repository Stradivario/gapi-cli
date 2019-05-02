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
const args_service_1 = require("../core/services/args.service");
const exec_service_1 = require("../core/services/exec.service");
const config_service_1 = require("../core/services/config.service");
const fs_1 = require("fs");
const util_1 = require("util");
const os_1 = require("os");
const { mkdirp } = require('@rxdi/core/dist/services/file/dist');
let SchemaTask = class SchemaTask {
    constructor() {
        this.execService = core_1.Container.get(exec_service_1.ExecService);
        this.argsService = core_1.Container.get(args_service_1.ArgsService);
        this.configService = core_1.Container.get(config_service_1.ConfigService);
        this.gapiFolder = `${os_1.homedir()}/.gapi`;
        this.daemonFolder = `${this.gapiFolder}/daemon`;
        this.cacheFolder = `${this.daemonFolder}/.cache`;
    }
    run(introspectionEndpoint, introspectionOutputFolder, pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalConsole = console.log.bind(console);
            console.log = function () {
                return originalConsole.apply(console, [
                    '\x1b[36m%s\x1b[0m',
                    `${process.cwd()} =>`,
                    ...arguments
                ]);
            };
            this.folder =
                introspectionOutputFolder ||
                    this.configService.config.config.schema.introspectionOutputFolder;
            this.endpoint =
                introspectionEndpoint ||
                    this.configService.config.config.schema.introspectionEndpoint;
            this.pattern = pattern || this.configService.config.config.schema.pattern;
            this.node_modules = __dirname.replace('dist/tasks', 'node_modules');
            this.bashFolder = __dirname.replace('dist/tasks', 'bash');
            if (process.argv[3] === 'introspect') {
                yield this.createDir();
                yield this.generateSchema();
                console.log(`Typings introspection based on GAPI Schema created inside folder: ${this.folder}/index.d.ts`);
            }
            if (process.argv[3] === 'collect' ||
                this.argsService.args.includes('--collect-documents')) {
                yield this.createDir();
                yield this.collectQueries();
                console.log(`Schema documents created inside folder: ${this.folder}/documents.json`);
            }
            console.log(`To change export folder for this command you need to check this link https://github.com/Stradivario/gapi-cli/wiki/schema`);
        });
    }
    createDir() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield util_1.promisify(fs_1.exists)(this.folder))) {
                yield util_1.promisify(mkdirp)(this.folder);
            }
            yield util_1.promisify(mkdirp)(this.cacheFolder);
        });
    }
    collectQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            const randomString = Math.random().toString(36).substring(2);
            yield this.execService.call(`node ${this.node_modules}/graphql-document-collector/bin/graphql-document-collector '${this.pattern ? this.pattern : '**/*.graphql'}' > ${this.cacheFolder}/${randomString}.json`);
            const readDocumentsTemp = yield util_1.promisify(fs_1.readFile)(`${this.cacheFolder}/${randomString}.json`, 'utf-8');
            yield util_1.promisify(fs_1.unlink)(`${this.cacheFolder}/${randomString}.json`);
            if (this.argsService.args.includes('--collect-types')) {
                yield this.generateTypes(readDocumentsTemp);
            }
            const parsedDocuments = `/* tslint:disable */ \n export const DOCUMENTS = ${readDocumentsTemp};`;
            yield util_1.promisify(fs_1.writeFile)(`${this.folder}/documents.ts`, parsedDocuments, 'utf8');
        });
    }
    generateSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Trying to hit ${this.endpoint} ...`);
            yield this.execService.call(`export NODE_TLS_REJECT_UNAUTHORIZED=0 && node ${this.node_modules}/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${this.folder}/schema.json`, { async: true });
            console.log(`Endpoint ${this.endpoint} hit!`);
            yield this.execService.call(`export NODE_TLS_REJECT_UNAUTHORIZED=0 && node  ${this.bashFolder}/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/index.ts`, { async: true });
        });
    }
    generateTypes(readDocumentsTemp) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedDocuments = Object.keys(JSON.parse(readDocumentsTemp))
                .map(key => {
                const n = key.lastIndexOf('/');
                const result = key.substring(n + 1);
                if (result === 'ListMovies.graphql') {
                    return;
                }
                if (result === 'Place.graphql') {
                    return;
                }
                if (result === 'Movie.graphql') {
                    return;
                }
                return result;
            }).filter(i => !!i);
            const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const DocumentTypes = strEnum(${JSON.stringify(savedDocuments)
                .replace(/"/g, `'`)
                .replace(/,/g, ',\n')});
export type DocumentTypes = keyof typeof DocumentTypes;`;
            return yield util_1.promisify(fs_1.writeFile)(`${this.folder}/documentTypes.ts`, types, 'utf8');
        });
    }
};
SchemaTask = __decorate([
    core_1.Service()
], SchemaTask);
exports.SchemaTask = SchemaTask;

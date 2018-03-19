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
const fs_1 = require("fs");
let SchemaTask = class SchemaTask {
    constructor() {
        this.execService = typedi_1.Container.get(exec_service_1.ExecService);
        this.argsService = typedi_1.Container.get(args_service_1.ArgsService);
        this.configService = typedi_1.Container.get(config_service_1.ConfigService);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.folder = this.configService.config.config.schema.introspectionOutputFolder;
            this.endpoint = this.configService.config.config.schema.introspectionEndpoint;
            this.node_modules = __dirname.replace('tasks', 'node_modules');
            this.bashFolder = __dirname.replace('tasks', 'bash');
            if (process.argv[3] === 'introspect') {
                if (!fs_1.existsSync(this.folder)) {
                    fs_1.mkdirSync(this.folder);
                }
                yield this.generateSchema();
                console.log(`Typings introspection based on GAPI Schema created inside folder: ${this.folder}/index.d.ts`);
            }
            if (process.argv[3] === 'collect' || this.argsService.args.includes('--collect-documents')) {
                if (!fs_1.existsSync(this.folder)) {
                    fs_1.mkdirSync(this.folder);
                }
                yield this.collectQueries();
                console.log(`Schema documents created inside folder: ${this.folder}/documents.json`);
            }
            console.log(`To change export folder for this command you need to check this link https://github.com/Stradivario/gapi-cli/wiki/schema`);
        });
    }
    collectQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execService.call(`node ${this.node_modules}/graphql-document-collector/bin/graphql-document-collector '**/*.graphql' > ${this.folder}/documents-temp.json`);
            const readDocumentsTemp = fs_1.readFileSync(`${this.folder}/documents-temp.json`, 'utf-8');
            fs_1.unlinkSync(`${this.folder}/documents-temp.json`);
            const parsedDocuments = `/* tslint:disable */ \n export const DOCUMENTS = JSON.parse(${JSON.stringify(readDocumentsTemp)})`;
            fs_1.writeFileSync(`${this.folder}/documents.ts`, parsedDocuments, 'utf8');
        });
    }
    generateSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execService.call(`node ${this.node_modules}/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${this.folder}/schema.json`, { async: true });
            yield this.execService.call(`node  ${this.bashFolder}/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/index.d.ts`, { async: true });
        });
    }
};
SchemaTask = __decorate([
    typedi_1.Service()
], SchemaTask);
exports.SchemaTask = SchemaTask;

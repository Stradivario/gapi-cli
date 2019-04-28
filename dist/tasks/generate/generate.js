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
const schematic_runner_1 = require("./runners/schematic.runner");
const index_1 = require("../../core/helpers/index");
let GenerateTask = class GenerateTask {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const dryRun = index_1.includes('--dry-run');
            const force = index_1.includes('--force');
            let internalArguments = '';
            var args = process.argv.slice(3);
            let method = '';
            let sourceRoot = index_1.nextOrDefault('--source-root', 'src');
            let language = index_1.nextOrDefault('--language', 'ts');
            let hasSpec = false;
            if (args[0] === 'c' || args[0] === 'controller') {
                method = 'controller';
                hasSpec = true;
            }
            if (args[0] === 's' || args[0] === 'service') {
                method = 'service';
                hasSpec = true;
            }
            if (args[0] === 'm' || args[0] === 'module') {
                method = 'module';
            }
            if (args[0] === 't' || args[0] === 'type') {
                method = 'type';
            }
            if (args[0] === 'p' || args[0] === 'provider') {
                method = 'provider';
            }
            if (args[0] === 's' || args[0] === 'service') {
                method = 'service';
            }
            if (args[0] === 'g' || args[0] === 'guard') {
                method = 'guard';
            }
            if (args[0] === 'i' || args[0] === 'interceptor') {
                method = 'interceptor';
            }
            if (args[0] === 'e' || args[0] === 'effect') {
                method = 'effect';
            }
            if (args[0] === 'e' || args[0] === 'effect') {
                method = 'effect';
            }
            if (args[0] === 'pg' || args[0] === 'plugin') {
                method = 'plugin';
                internalArguments = `--method=${index_1.nextOrDefault('--method', 'GET')}`;
            }
            if (!method) {
                throw new Error('Method not specified');
            }
            try {
                yield new schematic_runner_1.SchematicRunner().run(`@rxdi/schematics:${method} --name=${args[1]} --force=${force} --dryRun=${dryRun} ${hasSpec ? '--spec' : ''} --language='${language}' --sourceRoot='${sourceRoot}' ${internalArguments}`);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
};
GenerateTask = __decorate([
    typedi_1.Service()
], GenerateTask);
exports.GenerateTask = GenerateTask;

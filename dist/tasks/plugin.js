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
const index_1 = require("../core/helpers/index");
const util_1 = require("util");
const fs_1 = require("fs");
const daemon_config_1 = require("../daemon-server/daemon.config");
let PluginTask = class PluginTask {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (index_1.includes('remove')) {
                return yield this.remove(index_1.nextOrDefault('remove', false));
            }
            if (index_1.includes('add')) {
                return yield this.add(index_1.nextOrDefault('add', false));
            }
        });
    }
    add(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateHash(hash);
            const hashes = yield this.readFile();
            const exist = hashes.filter(h => h === hash);
            if (exist.length) {
                console.error(`Plugin already exist ${hash}`);
                return;
            }
            yield this.writeHashesToFile([...hashes, hash]);
            console.log(`Plugin installed ${hash}`);
            if (!hash) {
                throw new Error('Missing ipfs hash');
            }
        });
    }
    validateHash(hash) {
        if (!hash || hash.length !== 46) {
            throw new Error(`This is not correct ipfs hash ${hash}`);
        }
    }
    remove(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateHash(hash);
            yield this.writeHashesToFile((yield this.readFile()).filter(h => h !== hash));
        });
    }
    readFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let hashes = [];
            if (yield util_1.promisify(fs_1.exists)(daemon_config_1.IPFS_HASHED_MODULES)) {
                hashes = JSON.parse(yield util_1.promisify(fs_1.readFile)(daemon_config_1.IPFS_HASHED_MODULES, { encoding: 'utf8' }));
            }
            else {
                yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES, JSON.stringify([], null, 4), { encoding: 'utf8' });
            }
            return hashes;
        });
    }
    writeHashesToFile(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES, JSON.stringify(hashes, null, 4), { encoding: 'utf8' });
        });
    }
};
PluginTask = __decorate([
    core_1.Service()
], PluginTask);
exports.PluginTask = PluginTask;

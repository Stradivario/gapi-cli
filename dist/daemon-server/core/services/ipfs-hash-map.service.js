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
const core_1 = require("@gapi/core");
const util_1 = require("util");
const fs_1 = require("fs");
const daemon_config_1 = require("../../daemon.config");
let IpfsHashMapService = class IpfsHashMapService {
    constructor() {
        this.hashMap = [];
    }
    writeHashMapToFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES_MAP, JSON.stringify(this.hashMap, null, 4), { encoding: 'utf8' });
        });
    }
    readHashMap() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield util_1.promisify(fs_1.exists)(daemon_config_1.IPFS_HASHED_MODULES_MAP)) {
                this.hashMap = JSON.parse(yield util_1.promisify(fs_1.readFile)(daemon_config_1.IPFS_HASHED_MODULES_MAP, { encoding: 'utf8' }));
            }
            else {
                yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES_MAP, JSON.stringify([], null, 4), { encoding: 'utf8' });
            }
        });
    }
    find(hash) {
        return this.hashMap.filter(m => m.hash === hash)[0];
    }
    remove(hash) {
        this.hashMap = this.hashMap.filter(m => m.hash !== hash);
    }
};
IpfsHashMapService = __decorate([
    core_1.Injectable()
], IpfsHashMapService);
exports.IpfsHashMapService = IpfsHashMapService;

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
const util_1 = require("util");
const fs_1 = require("fs");
const daemon_config_1 = require("../../daemon.config");
let ListService = class ListService {
    constructor() {
        this.linkedList = [];
    }
    readList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.linkedList = JSON.parse(yield util_1.promisify(fs_1.readFile)(daemon_config_1.GAPI_DAEMON_PROCESS_LIST_FOLDER, {
                    encoding: 'utf-8'
                }));
            }
            catch (e) { }
            return this.linkedList;
        });
    }
    findByRepoPath(repoPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.readList()).filter(l => l.repoPath === repoPath);
        });
    }
    findByLinkName(linkName) {
        return {
            results: () => __awaiter(this, void 0, void 0, function* () { return (yield this.readList()).filter(l => l.linkName === linkName); }),
            exclude: (isNotLike) => __awaiter(this, void 0, void 0, function* () {
                return (yield this.readList()).filter(l => l.linkName === linkName && l.repoPath !== isNotLike);
            })
        };
    }
};
ListService = __decorate([
    core_1.Injectable()
], ListService);
exports.ListService = ListService;

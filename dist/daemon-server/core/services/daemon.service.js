"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const list_service_1 = require("./list.service");
const child_service_1 = require("./child.service");
const os_1 = require("os");
const { mkdirp } = require('@rxdi/core/dist/services/file/dist');
let DaemonService = class DaemonService {
    constructor(listService, childService) {
        this.listService = listService;
        this.childService = childService;
        this.noop = rxjs_1.of([]);
        this.gapiFolder = `${os_1.homedir()}/.gapi`;
        this.daemonFolder = `${this.gapiFolder}/daemon`;
        this.processListFile = `${this.daemonFolder}/process-list`;
    }
    notifyDaemon(payload) {
        return this.findByRepoPath(payload).pipe(operators_1.switchMap(([mainNode]) => this.saveMainNode(Object.assign(mainNode ? mainNode : {}, payload))), operators_1.switchMap((mainNode) => this.findLinkedRepos(mainNode)), operators_1.switchMap(otherRepos => rxjs_1.combineLatest([
            this.trigger(payload),
            ...otherRepos.map(r => this.trigger(this.mergeServerMetadata(r, payload.serverMetadata)))
        ])), operators_1.map(() => payload));
    }
    trigger(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield util_1.promisify(fs_1.exists)(payload.repoPath))) {
                yield util_1.promisify(mkdirp)(payload.repoPath);
            }
            const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
            if (!(yield util_1.promisify(fs_1.exists)(gapiLocalConfig))) {
                yield this.writeGapiCliConfig(gapiLocalConfig, payload);
            }
            const args = [
                'schema',
                'introspect',
                '--collect-documents',
                '--collect-types'
            ];
            yield this.childService.spawn('gapi', args, payload.repoPath);
            return payload;
        });
    }
    saveMainNode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let processList = [];
            const encoding = 'utf8';
            try {
                processList = JSON.parse(yield util_1.promisify(fs_1.readFile)(this.processListFile, { encoding }));
            }
            catch (e) { }
            yield util_1.promisify(fs_1.writeFile)(this.processListFile, JSON.stringify(processList
                .filter(p => p.repoPath !== payload.repoPath)
                .concat(payload)), { encoding });
            return payload;
        });
    }
    writeGapiCliConfig(gapiLocalConfig, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let port = 9000;
            if (payload.serverMetadata.port) {
                port = payload.serverMetadata.port;
            }
            return yield util_1.promisify(fs_1.writeFile)(gapiLocalConfig, `
config:
  schema:
    introspectionEndpoint: http://localhost:${port}/graphql
    introspectionOutputFolder: ./api-introspection
`);
        });
    }
    findByRepoPath(payload) {
        return rxjs_1.from(this.listService.readList()).pipe(operators_1.switchMap(list => list.length
            ? this.listService.findByRepoPath(payload.repoPath)
            : this.noop));
    }
    findLinkedRepos(repo) {
        return repo && repo.linkName
            ? this.listService.findByLinkName(repo.linkName).exclude(repo.repoPath)
            : this.noop;
    }
    mergeServerMetadata(repo, serverMetadata) {
        return Object.assign({}, repo, { serverMetadata });
    }
};
DaemonService = __decorate([
    core_1.Service(),
    __metadata("design:paramtypes", [list_service_1.ListService,
        child_service_1.ChildService])
], DaemonService);
exports.DaemonService = DaemonService;

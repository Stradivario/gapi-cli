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
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const daemon_config_1 = require("../../daemon.config");
let PluginLoader = class PluginLoader {
    constructor(externalImporterService, fileService) {
        this.externalImporterService = externalImporterService;
        this.fileService = fileService;
        this.hashCache = {};
        this.defaultIpfsProvider = "https://ipfs.io/ipfs/";
        this.defaultDownloadFilename = "gapi-plugin";
    }
    getModule(hash, provider = this.defaultIpfsProvider) {
        if (this.hashCache[hash]) {
            return this.hashCache[hash];
        }
        return this.externalImporterService
            .downloadIpfsModuleConfig({
            hash,
            provider
        })
            .pipe(operators_1.take(1), operators_1.tap((em) => console.log(`Plugin loaded: ${em.name} hash: ${this.defaultIpfsProvider}${hash}`)), operators_1.switchMap((externalModule) => this.externalImporterService.importModule({
            fileName: this.defaultDownloadFilename,
            namespace: externalModule.name,
            extension: "js",
            outputFolder: `${daemon_config_1.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/`,
            link: `${this.defaultIpfsProvider}${externalModule.module}`
        }, externalModule.name, { folderOverride: `//` })), operators_1.map(data => {
            const currentModule = this.loadModule(data);
            this.hashCache[hash] = currentModule;
            console.log(currentModule.metadata.moduleHash);
            return currentModule;
        }));
    }
    loadModule(m) {
        return m[Object.keys(m)[0]];
    }
    loadPlugins(ipfsHashes = [], pluginsFolder = daemon_config_1.GAPI_DAEMON_PLUGINS_FOLDER) {
        return this.fileService.mkdirp(pluginsFolder).pipe(operators_1.switchMap(() => this.fileService.fileWalker(pluginsFolder)), operators_1.switchMap(p => Promise.all([...new Set(p)]
            .map((path) => __awaiter(this, void 0, void 0, function* () {
            return !new RegExp(/^(.(?!.*\.js$))*$/g).test(path)
                ? yield this.loadModule(require(path))
                : null;
        }))
            .filter(p => !!p))), operators_1.switchMap(pluginModules => rxjs_1.of(null).pipe(operators_1.combineLatest([...new Set(ipfsHashes)].map(hash => this.getModule(hash))), operators_1.map(externalModules => [
            ...new Set([...externalModules, ...pluginModules])
        ]), operators_1.map(m => m.filter(i => !!i)))));
    }
};
PluginLoader = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ExternalImporter,
        core_1.FileService])
], PluginLoader);
exports.PluginLoader = PluginLoader;

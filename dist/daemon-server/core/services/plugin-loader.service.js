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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const daemon_config_1 = require("../../daemon.config");
const plugin_watcher_service_1 = require("./plugin-watcher.service");
const fs_1 = require("fs");
const util_1 = require("util");
const ipfs_hash_map_service_1 = require("./ipfs-hash-map.service");
let PluginLoader = class PluginLoader {
    constructor(externalImporterService, fileService, pluginWatcherService, ipfsHashMapService) {
        this.externalImporterService = externalImporterService;
        this.fileService = fileService;
        this.pluginWatcherService = pluginWatcherService;
        this.ipfsHashMapService = ipfsHashMapService;
        this.defaultIpfsProvider = 'https://ipfs.io/ipfs/';
        this.defaultDownloadFilename = 'gapi-plugin';
        this.filterDups = (modules) => [...new Set(modules.map(i => i.metadata.moduleHash))].map(m => this.cache[m]);
        this.cache = {};
    }
    loadPlugins() {
        return this.makePluginsDirectories().pipe(operators_1.switchMap(() => this.ipfsHashMapService.readHashMap()), operators_1.switchMap(() => this.pluginWatcherService.watch()), 
        // switchMap(() => this.fileService.fileWalker(pluginsFolder)),
        operators_1.map(p => [...new Set(p)].map(path => !new RegExp(/^(.(?!.*\.js$))*$/g).test(path)
            ? this.loadModule(require(path))
            : null)), operators_1.switchMap(pluginModules => rxjs_1.of(null).pipe(operators_1.combineLatest([...new Set(this.loadIpfsHashes())].map(hash => this.getModule(hash))), operators_1.map(externalModules => externalModules.concat(pluginModules)), operators_1.map(m => m.filter(i => !!i)), operators_1.map((modules) => this.filterDups(modules)), operators_1.tap(() => this.ipfsHashMapService.writeHashMapToFile()))));
    }
    loadIpfsHashes() {
        let hashes = [];
        try {
            hashes = JSON.parse(fs_1.readFileSync(daemon_config_1.IPFS_HASHED_MODULES, { encoding: 'utf8' }));
        }
        catch (e) { }
        return hashes;
    }
    getModule(hash, provider = this.defaultIpfsProvider) {
        return this.externalImporterService
            .downloadIpfsModuleConfig({
            hash,
            provider
        })
            .pipe(operators_1.take(1), operators_1.tap((externalModule) => {
            const isPresent = this.ipfsHashMapService.hashMap.filter(h => h.hash === hash).length;
            if (!isPresent) {
                this.ipfsHashMapService.hashMap.push({
                    hash,
                    module: {
                        fileName: this.defaultDownloadFilename,
                        namespace: externalModule.name,
                        extension: 'js',
                        outputFolder: `${daemon_config_1.GAPI_DAEMON_IPFS_PLUGINS_FOLDER}/`,
                        link: `${this.defaultIpfsProvider}${externalModule.module}`
                    }
                });
            }
        }), operators_1.switchMap((externalModule) => this.externalImporterService.importModule({
            fileName: this.defaultDownloadFilename,
            namespace: externalModule.name,
            extension: 'js',
            outputFolder: `${daemon_config_1.GAPI_DAEMON_IPFS_PLUGINS_FOLDER}/`,
            link: `${this.defaultIpfsProvider}${externalModule.module}`
        }, externalModule.name, { folderOverride: `//` })), operators_1.map((data) => this.loadModule(data)));
    }
    cacheModule(currentModule) {
        if (!currentModule.metadata) {
            throw new Error('Missing metadata for module maybe it is not from @rxdi infrastructure ?');
        }
        return (this.cache[currentModule.metadata.moduleHash] = currentModule);
    }
    loadModule(m) {
        const currentModule = m[Object.keys(m)[0]];
        if (!currentModule) {
            throw new Error(`Missing cache module ${JSON.stringify(m)}`);
        }
        return this.cacheModule(currentModule);
    }
    makeIpfsHashFile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield util_1.promisify(fs_1.exists)(daemon_config_1.IPFS_HASHED_MODULES))) {
                yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES, JSON.stringify([], null, 4), { encoding: 'utf8' });
            }
        });
    }
    makePluginsDirectories() {
        return rxjs_1.of(true).pipe(operators_1.switchMap(() => this.fileService.mkdirp(daemon_config_1.GAPI_DAEMON_IPFS_PLUGINS_FOLDER)), operators_1.switchMap(() => this.fileService.mkdirp(daemon_config_1.GAPI_DAEMON_HTTP_PLUGINS_FOLDER)), operators_1.switchMap(() => this.fileService.mkdirp(daemon_config_1.GAPI_DAEMON_PLUGINS_FOLDER)), operators_1.switchMap(() => this.makeIpfsHashFile()));
    }
};
PluginLoader = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ExternalImporter,
        core_1.FileService,
        plugin_watcher_service_1.PluginWatcherService,
        ipfs_hash_map_service_1.IpfsHashMapService])
], PluginLoader);
exports.PluginLoader = PluginLoader;

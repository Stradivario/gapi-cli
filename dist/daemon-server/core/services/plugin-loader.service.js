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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rxjs_2 = require("rxjs");
const os_1 = require("os");
let PluginLoader = class PluginLoader {
    constructor(externalImporterService, fileService) {
        this.externalImporterService = externalImporterService;
        this.fileService = fileService;
        this.hashCache = {};
        this.defaultPluginsFolder = `${os_1.homedir()}/.gapi/daemon/plugins`;
        this.defaultExternalPluginsFolder = '/plugins/';
        this.defaultIpfsProvider = 'https://ipfs.io/ipfs/';
        this.defaultDownloadFilename = 'gapi-plugin';
        this.getModule = (hash, provider = this.defaultIpfsProvider) => {
            if (this.hashCache[hash]) {
                return this.hashCache[hash];
            }
            return new rxjs_1.Observable(o => {
                this.externalImporterService
                    .downloadIpfsModuleConfig({
                    hash,
                    provider
                })
                    .pipe(operators_1.take(1), operators_1.tap((em) => console.log(`Plugin loaded: ${em.name} hash: ${this.defaultIpfsProvider}${hash}`)), operators_1.switchMap((externalModule) => this.externalImporterService.importModule({
                    fileName: this.defaultDownloadFilename,
                    namespace: externalModule.name,
                    extension: 'js',
                    outputFolder: this.defaultExternalPluginsFolder,
                    link: `${this.defaultIpfsProvider}${externalModule.module}`
                }, externalModule.name)))
                    .subscribe(data => {
                    const currentModule = this.loadModule(data);
                    this.hashCache[hash] = currentModule;
                    console.log(currentModule.metadata.moduleHash);
                    o.next(currentModule);
                    o.complete();
                }, e => {
                    o.error(e);
                    o.complete();
                });
            });
        };
    }
    loadModule(m) {
        return m[Object.keys(m)[0]];
    }
    loadPlugins(modules = [], pluginsFolder = this.defaultPluginsFolder) {
        let plugins = rxjs_2.of([]);
        if (this.fileService.isPresent(pluginsFolder)) {
            plugins = this.fileService.fileWalker(pluginsFolder);
        }
        return plugins.pipe(operators_1.map(p => {
            return [...new Set(p)]
                .map(path => {
                if (!(new RegExp(/^(.(?!.*\.js$))*$/g).test(path))) {
                    return this.loadModule(require(path));
                }
            })
                .filter(p => !!p);
        }), operators_1.switchMap(pluginModules => rxjs_2.of(null).pipe(operators_1.combineLatest([...new Set(modules)].map(hash => this.getModule(hash))), operators_1.map(externalModules => [...new Set([...externalModules, ...pluginModules])]), operators_1.map(m => m.filter(i => !!i)))));
    }
};
PluginLoader = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ExternalImporter,
        core_1.FileService])
], PluginLoader);
exports.PluginLoader = PluginLoader;

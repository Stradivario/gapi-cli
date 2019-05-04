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
const chokidar_1 = require("chokidar");
const daemon_config_1 = require("../../daemon.config");
const child_service_1 = require("./child.service");
const rxjs_1 = require("rxjs");
let PluginWatcherService = class PluginWatcherService {
    constructor(childService, fileService) {
        this.childService = childService;
        this.fileService = fileService;
    }
    isNotFromExternalPlugins(path) {
        return !path.includes('external-plugins');
    }
    watch() {
        return new rxjs_1.Observable(observer => {
            const initPlugins = [];
            let isInitFinished = false;
            const watcher = chokidar_1.watch([
                `${daemon_config_1.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/**/*.js`,
                `${daemon_config_1.GAPI_DAEMON_PLUGINS_FOLDER}/**/*.js`,
                daemon_config_1.IPFS_HASHED_MODULES,
            ], {
                ignored: /^\./,
                persistent: true
            });
            watcher
                .on('add', (path) => {
                if (!isInitFinished && this.isNotFromExternalPlugins(path)) {
                    console.log('Plugin', path, 'has been added');
                    initPlugins.push(path);
                }
                else {
                    console.log('Present external module', path);
                }
                if (isInitFinished && this.isNotFromExternalPlugins(path)) {
                    this.restartDaemon();
                }
            })
                .on('change', (path) => {
                console.log('File', path, 'has been changed');
                if (isInitFinished) {
                    this.restartDaemon();
                }
            })
                .on('ready', () => {
                console.log('Initial scan complete. Ready for changes');
                isInitFinished = true;
                observer.next(initPlugins);
                observer.complete();
            })
                .on('unlink', path => {
                console.log('File', path, 'has been removed');
                if (isInitFinished) {
                    this.restartDaemon();
                }
            })
                .on('error', error => console.error('Error happened', error));
        });
    }
    restartDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.childService.spawn('gapi', ['daemon', 'restart'], process.cwd());
            process.exit();
        });
    }
};
PluginWatcherService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [child_service_1.ChildService,
        core_1.FileService])
], PluginWatcherService);
exports.PluginWatcherService = PluginWatcherService;

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
const server_module_1 = require("../daemon-server/server.module");
const core_2 = require("@gapi/core");
const operators_1 = require("rxjs/operators");
const plugin_loader_service_1 = require("../daemon-server/core/services/plugin-loader.service");
const plugin_watcher_service_1 = require("../daemon-server/core/services/plugin-watcher.service");
const helpers_1 = require("../core/helpers");
let BootstrapTask = class BootstrapTask {
    constructor(pluginLoader) {
        this.pluginLoader = pluginLoader;
    }
    run(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pluginLoader
                .loadPlugins()
                .pipe(operators_1.switchMap(pluginModules => core_1.setup({
                imports: [
                    ...pluginModules,
                    core_2.CoreModule.forRoot(options || {
                        server: {
                            hapi: {
                                port: helpers_1.nextOrDefault('--port', 42000, (p) => Number(p))
                            }
                        },
                        graphql: {
                            openBrowser: false,
                            graphiql: false,
                            graphiQlPlayground: false
                        }
                        // pubsub: {
                        //   host: 'localhost',
                        //   port: 5672,
                        //   log: true,
                        //   activateRabbitMQ: true
                        // },
                        // daemon: {
                        //   activated: true,
                        //   link: 'http://localhost:42001/graphql'
                        // }
                    }),
                    server_module_1.ServerModule
                ],
                providers: [
                    plugin_watcher_service_1.PluginWatcherService
                ]
            })))
                .subscribe(() => console.log('Daemon started'), console.error.bind(console));
        });
    }
};
BootstrapTask = __decorate([
    core_1.Service(),
    __metadata("design:paramtypes", [plugin_loader_service_1.PluginLoader])
], BootstrapTask);
exports.BootstrapTask = BootstrapTask;

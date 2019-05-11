"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const list_service_1 = require("./services/list.service");
const daemon_service_1 = require("./services/daemon.service");
const child_service_1 = require("./services/child.service");
const ipfs_hash_map_service_1 = require("./services/ipfs-hash-map.service");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    core_1.Module({
        services: [list_service_1.ListService, daemon_service_1.DaemonService, child_service_1.ChildService, ipfs_hash_map_service_1.IpfsHashMapService]
    })
], CoreModule);
exports.CoreModule = CoreModule;

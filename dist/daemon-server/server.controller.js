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
const core_1 = require("@gapi/core");
const list_service_1 = require("./core/services/list.service");
const link_list_type_1 = require("./types/link-list.type");
const daemon_service_1 = require("./core/services/daemon.service");
const rxjs_1 = require("rxjs");
const server_metadata_type_1 = require("./types/server-metadata.type");
const notify_interceptor_1 = require("./core/interceptors/notify.interceptor");
let ServerController = class ServerController {
    constructor(listService, daemonService, pubsub) {
        this.listService = listService;
        this.daemonService = daemonService;
        this.pubsub = pubsub;
        let count = 0;
        setInterval(() => {
            pubsub.publish('CREATE_SIGNAL_BASIC', count++);
        }, 2000);
    }
    statusSubscription(message) {
        return {
            repoPath: message
        };
    }
    getLinkList() {
        return this.listService.readList();
    }
    notifyDaemon(root, payload) {
        return this.daemonService.notifyDaemon(payload);
    }
};
__decorate([
    core_1.Type(link_list_type_1.LinkListType),
    core_1.Subscribe((self) => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')),
    core_1.Interceptor(notify_interceptor_1.NotifyInterceptor),
    core_1.Subscription(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "statusSubscription", null);
__decorate([
    core_1.Type(new core_1.GraphQLList(link_list_type_1.LinkListType)),
    core_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "getLinkList", null);
__decorate([
    core_1.Type(link_list_type_1.LinkListType),
    core_1.Interceptor(notify_interceptor_1.NotifyInterceptor),
    core_1.Mutation({
        repoPath: {
            type: new core_1.GraphQLNonNull(core_1.GraphQLString)
        },
        introspectionPath: {
            type: core_1.GraphQLString
        },
        linkName: {
            type: core_1.GraphQLString
        },
        serverMetadata: {
            type: server_metadata_type_1.ServerMetadataInputType
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ServerController.prototype, "notifyDaemon", null);
ServerController = __decorate([
    core_1.Controller(),
    __metadata("design:paramtypes", [list_service_1.ListService,
        daemon_service_1.DaemonService,
        core_1.PubSubService])
], ServerController);
exports.ServerController = ServerController;

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
const server_type_1 = require("./server.type");
const list_service_1 = require("./core/services/list.service");
const link_list_type_1 = require("./types/link-list.type");
const child_process_1 = require("child_process");
let ServerController = class ServerController {
    constructor(pubsub, listService) {
        this.pubsub = pubsub;
        this.listService = listService;
        let count = 0;
        setInterval(() => {
            count++;
            pubsub.publish('CREATE_SIGNAL_BASIC', `AZ${count}`);
        }, 2000);
    }
    statusSubscription(message) {
        return {
            status: message
        };
    }
    serverRestarted(message) {
        return {
            status: message
        };
    }
    getLinkList() {
        return this.listService.readList();
    }
    notifyDaemon(root, payload) {
        return new Promise((resolve, reject) => {
            console.log(payload);
            const child = child_process_1.spawn('gapi', ['schema', 'introspect', '--collect-documents', '--collect-types'], {
                cwd: payload.repoPath
            });
            child.stdout.on('data', data => {
                process.stdout.write(data);
                if (data
                    .toString('utf8')
                    .includes('Typings introspection based on GAPI Schema created inside folder')) {
                    resolve(payload);
                }
            });
            child.stderr.on('data', data => {
                process.stderr.write(data);
                reject(data.toString('utf8'));
            });
            child.on('close', code => {
                console.log(`child process exited with code ${code}`);
                resolve(payload);
            });
        });
    }
};
__decorate([
    core_1.Type(server_type_1.SubscriptionStatusType),
    core_1.Subscribe((self) => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')),
    core_1.Subscription(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "statusSubscription", null);
__decorate([
    core_1.Type(server_type_1.SubscriptionStatusType),
    core_1.Subscribe((self) => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')),
    core_1.Subscription(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "serverRestarted", null);
__decorate([
    core_1.Type(new core_1.GraphQLList(link_list_type_1.LinkListType)),
    core_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "getLinkList", null);
__decorate([
    core_1.Type(link_list_type_1.LinkListType),
    core_1.Mutation({
        repoPath: {
            type: core_1.GraphQLString
        },
        introspectionPath: {
            type: core_1.GraphQLString
        },
        linkName: {
            type: core_1.GraphQLString
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "notifyDaemon", null);
ServerController = __decorate([
    core_1.Controller(),
    __metadata("design:paramtypes", [core_1.PubSubService, list_service_1.ListService])
], ServerController);
exports.ServerController = ServerController;

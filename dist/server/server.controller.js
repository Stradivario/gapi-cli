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
let ServerController = class ServerController {
    constructor(pubsub) {
        this.pubsub = pubsub;
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
};
__decorate([
    core_1.Type(server_type_1.SubscriptionStatusType),
    core_1.Subscribe((self) => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')),
    core_1.Subscription(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "statusSubscription", null);
ServerController = __decorate([
    core_1.Controller(),
    __metadata("design:paramtypes", [core_1.PubSubService])
], ServerController);
exports.ServerController = ServerController;

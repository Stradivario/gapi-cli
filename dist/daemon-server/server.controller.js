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
const core_1 = require("@gapi/core");
const list_service_1 = require("./core/services/list.service");
const link_list_type_1 = require("./types/link-list.type");
const daemon_service_1 = require("./core/services/daemon.service");
let ServerController = class ServerController {
    constructor(listService, daemonService) {
        this.listService = listService;
        this.daemonService = daemonService;
    }
    getLinkList() {
        return this.listService.readList();
    }
    notifyDaemon(root, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let otherRepos = [];
            if ((yield this.listService.readList()).length) {
                const [repo] = yield this.listService.findByRepoPath(payload.repoPath);
                if (repo && repo.linkName) {
                    otherRepos = yield this.listService.findByLinkName(repo.linkName, repo.repoPath);
                }
            }
            yield Promise.all([
                yield this.daemonService.trigger(payload),
                ...otherRepos.map((r) => __awaiter(this, void 0, void 0, function* () { return yield this.daemonService.trigger(r); }))
            ]);
            return payload;
        });
    }
};
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
    __metadata("design:returntype", Promise)
], ServerController.prototype, "notifyDaemon", null);
ServerController = __decorate([
    core_1.Controller(),
    __metadata("design:paramtypes", [list_service_1.ListService,
        daemon_service_1.DaemonService])
], ServerController);
exports.ServerController = ServerController;

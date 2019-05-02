"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const child_process_1 = require("child_process");
let ChildService = class ChildService {
    spawn(command, args, cwd, wait = 30 * 1000) {
        return new Promise((resolve, reject) => {
            const child = child_process_1.spawn(command, args, { cwd, detached: true });
            const timeout = setTimeout(() => {
                const message = `${command} ${args.toString()} exited with timeout after ${wait / 1000} seconds`;
                child.kill(message);
                reject(message);
                clearTimeout(timeout);
            }, wait);
            child.stdout.on('data', data => process.stdout.write(data));
            child.stderr.on('data', data => process.stderr.write(data));
            child.on('close', code => {
                clearTimeout(timeout);
                if (!code) {
                    resolve(code);
                }
                else {
                    reject(code);
                }
            });
        });
    }
};
ChildService = __decorate([
    core_1.Injectable()
], ChildService);
exports.ChildService = ChildService;

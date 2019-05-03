"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@gapi/core");
const operators_1 = require("rxjs/operators");
let NotifyInterceptor = class NotifyInterceptor {
    intercept(chainable$, context, payload, descriptor) {
        console.log('Before...');
        const options = { timeout: 2 };
        // notifier.notify({
        //     'title': `Daemon triggered!`,
        //     'message': `${payload.repoPath}`,
        //     ...options
        // });
        const now = Date.now();
        return chainable$.pipe(operators_1.tap(() => console.log(`After... ${Date.now() - now}ms`)));
    }
};
NotifyInterceptor = __decorate([
    core_1.Injectable()
], NotifyInterceptor);
exports.NotifyInterceptor = NotifyInterceptor;

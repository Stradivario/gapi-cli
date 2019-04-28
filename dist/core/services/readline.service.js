"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typedi_1 = require("typedi");
const readline_1 = require("readline");
let ReadlineService = class ReadlineService {
    createReadlineInterface() {
        return readline_1.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    clearScreenDown() {
        return __awaiter(this, void 0, void 0, function* () {
            return readline_1.clearScreenDown(process.stdin);
        });
    }
    createQuestion(question, task) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.readline = this.createReadlineInterface();
                this.readline.question(question, (answer) => {
                    try {
                        task(answer);
                    }
                    catch (e) {
                        console.error('Missing question internal library error!');
                    }
                    this.readline.close();
                    resolve();
                });
            });
        });
    }
};
ReadlineService = __decorate([
    typedi_1.Service()
], ReadlineService);
exports.ReadlineService = ReadlineService;

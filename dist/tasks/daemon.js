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
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const mkdirp = require("mkdirp");
const os_1 = require("os");
const util_1 = require("util");
const rimraf = require("rimraf");
const ps_list_1 = require("../core/helpers/ps-list");
const stringEnum_1 = require("../core/helpers/stringEnum");
const helpers_1 = require("../core/helpers");
const bootstrap_1 = require("./bootstrap");
const systemd_service_1 = require("../core/services/systemd.service");
exports.DaemonTasks = stringEnum_1.strEnum(['start', 'stop', 'clean', 'kill', 'bootstrap']);
let DaemonTask = class DaemonTask {
    constructor() {
        this.gapiFolder = `${os_1.homedir()}/.gapi`;
        this.daemonFolder = `${this.gapiFolder}/daemon`;
        this.outLogFile = `${this.daemonFolder}/out.log`;
        this.errLogFile = `${this.daemonFolder}/err.log`;
        this.pidLogFile = `${this.daemonFolder}/pid`;
        this.bootstrapTask = typedi_1.default.get(bootstrap_1.BootstrapTask);
        this.systemDService = typedi_1.default.get(systemd_service_1.SystemDService);
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            yield this.killDaemon();
            yield util_1.promisify(mkdirp)(this.daemonFolder);
            if (helpers_1.includes('--systemd')) {
                yield this.systemDService.register({
                    name: 'my-node-service',
                    cwd: __dirname.replace('tasks', 'core/helpers/'),
                    app: 'systemd-daemon.js',
                    engine: 'node',
                    env: {
                        PORT_2: 3002,
                    }
                });
            }
            else {
                const child = child_process_1.spawn('gapi', ['daemon', 'bootstrap'], {
                    detached: true,
                    stdio: [
                        'ignore',
                        fs_1.openSync(this.outLogFile, 'a'),
                        fs_1.openSync(this.errLogFile, 'a')
                    ]
                });
                yield util_1.promisify(fs_1.writeFile)(this.pidLogFile, child.pid, {
                    encoding: 'utf-8'
                });
                console.log('DAEMON STARTED!', `\nPID: ${child.pid}`);
                child.unref();
            }
        });
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            if (helpers_1.includes('--systemd')) {
                yield this.systemDService.remove('my-node-service');
            }
            else {
                yield this.killDaemon();
            }
        });
        this.kill = (pid) => process.kill(Number(pid));
        this.clean = () => util_1.promisify(rimraf)(this.daemonFolder);
        this.genericRunner = (task) => (args) => this[task](args || helpers_1.nextOrDefault(task, ''));
        this.tasks = new Map([
            [exports.DaemonTasks.start, this.genericRunner(exports.DaemonTasks.start)],
            [exports.DaemonTasks.stop, this.genericRunner(exports.DaemonTasks.stop)],
            [exports.DaemonTasks.clean, this.genericRunner(exports.DaemonTasks.clean)],
            [exports.DaemonTasks.kill, this.genericRunner(exports.DaemonTasks.kill)],
            [exports.DaemonTasks.bootstrap, this.genericRunner(exports.DaemonTasks.bootstrap)]
        ]);
    }
    bootstrap(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bootstrapTask.run(options);
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (helpers_1.includes(exports.DaemonTasks.clean)) {
                console.log(`Cleaning daemon garbage inside ${this.daemonFolder}!`);
                return yield this.tasks.get(exports.DaemonTasks.clean)();
            }
            if (helpers_1.includes(exports.DaemonTasks.start)) {
                console.log(`Stating daemon! Garbage is inside ${this.daemonFolder}!`);
                return yield this.tasks.get(exports.DaemonTasks.start)();
            }
            if (helpers_1.includes(exports.DaemonTasks.stop)) {
                console.log(`Stopping daemon! Garbage is inside ${this.daemonFolder}!`);
                return yield this.tasks.get(exports.DaemonTasks.stop)();
            }
            if (helpers_1.includes(exports.DaemonTasks.kill)) {
                return yield this.tasks.get(exports.DaemonTasks.kill)();
            }
            if (helpers_1.includes(exports.DaemonTasks.bootstrap)) {
                return yield this.tasks.get(exports.DaemonTasks.bootstrap)({
                    graphql: {
                        openBrowser: false,
                        graphiql: false,
                        graphiQlPlayground: false
                    }
                });
            }
            console.log('Missing command for Daemon');
        });
    }
    killDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
            const pid = yield this.readPidDaemonConfig();
            if (!pid) {
                console.log('Daemon is not running!');
                return;
            }
            if (yield this.isDaemonRunning(pid)) {
                console.log(`Daemon process ${pid} Killed!`);
                process.kill(pid);
            }
        });
    }
    readPidDaemonConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let pid;
            try {
                pid = Number(yield util_1.promisify(fs_1.readFile)(this.pidLogFile, { encoding: 'utf-8' }));
            }
            catch (e) { }
            return pid;
        });
    }
    isDaemonRunning(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pid) {
                return false;
            }
            return !!(yield this.getActiveDaemon(pid)).length;
        });
    }
    getActiveDaemon(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ps_list_1.getProcessList()).filter(p => p.pid === pid);
        });
    }
};
DaemonTask = __decorate([
    typedi_1.Service()
], DaemonTask);
exports.DaemonTask = DaemonTask;

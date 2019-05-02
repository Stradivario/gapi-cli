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
const core_1 = require("@rxdi/core");
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
const core_2 = require("@gapi/core");
const systemd_service_1 = require("../core/services/systemd.service");
const daemon_executor_service_1 = require("../core/services/daemon-executor/daemon-executor.service");
const yamljs_1 = require("yamljs");
exports.DaemonTasks = stringEnum_1.strEnum([
    'start',
    'stop',
    'clean',
    'kill',
    'bootstrap',
    'link',
    'unlink',
    'list',
    'restart',
    'status'
]);
let DaemonTask = class DaemonTask {
    constructor() {
        this.gapiFolder = `${os_1.homedir()}/.gapi`;
        this.daemonFolder = `${this.gapiFolder}/daemon`;
        this.outLogFile = `${this.daemonFolder}/out.log`;
        this.errLogFile = `${this.daemonFolder}/err.log`;
        this.pidLogFile = `${this.daemonFolder}/pid`;
        this.processListFile = `${this.daemonFolder}/process-list`;
        this.bootstrapTask = core_1.Container.get(bootstrap_1.BootstrapTask);
        this.systemDService = core_1.Container.get(systemd_service_1.SystemDService);
        this.daemonExecutorService = core_1.Container.get(daemon_executor_service_1.DaemonExecutorService);
        this.start = (name) => __awaiter(this, void 0, void 0, function* () {
            yield this.killDaemon();
            yield util_1.promisify(mkdirp)(this.daemonFolder);
            if (helpers_1.includes('--systemd')) {
                yield this.systemDService.register({
                    name: name || 'my-node-service',
                    cwd: __dirname.replace('tasks', 'core/helpers/'),
                    app: __dirname.replace('tasks', 'core/helpers/systemd-daemon.js'),
                    engine: 'node',
                    env: {}
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
        this.restart = (name) => __awaiter(this, void 0, void 0, function* () {
            yield this.stop();
            yield this.start();
        });
        this.stop = (name) => __awaiter(this, void 0, void 0, function* () {
            if (helpers_1.includes('--systemd')) {
                yield this.systemDService.remove(name || 'my-node-service');
            }
            else {
                yield this.killDaemon();
            }
        });
        this.list = () => __awaiter(this, void 0, void 0, function* () {
            const linkList = yield this.daemonExecutorService.getLinkList();
            console.log(linkList.data.getLinkList);
        });
        this.kill = (pid) => process.kill(Number(pid));
        this.status = () => __awaiter(this, void 0, void 0, function* () {
            console.log(`Daemon status: ${(yield this.isDaemonRunning()) ? 'active' : 'stopped'}`);
        });
        this.link = (linkName = 'default') => __awaiter(this, void 0, void 0, function* () {
            const encoding = 'utf-8';
            let config = { config: { schema: {} } };
            let processList = [];
            try {
                processList = JSON.parse(yield util_1.promisify(fs_1.readFile)(this.processListFile, { encoding }));
            }
            catch (e) { }
            config = yield this.readGapiConfig();
            config.config = config.config || {};
            config.config.schema = config.config.schema || {};
            const introspectionPath = config.config.schema.introspectionOutputFolder || `./api-introspection`;
            linkName = config.config.schema.linkName || linkName;
            const currentRepoProcess = {
                repoPath: process.cwd(),
                introspectionPath,
                linkName,
                serverMetadata: {}
            };
            yield util_1.promisify(fs_1.writeFile)(this.processListFile, JSON.stringify(processList
                .filter(p => p.repoPath !== process.cwd())
                .concat(currentRepoProcess)), { encoding });
            console.log(`Project linked ${process.cwd()} link name: ${currentRepoProcess.linkName}`);
        });
        this.unlink = () => __awaiter(this, void 0, void 0, function* () {
            let processList = [];
            const encoding = 'utf-8';
            try {
                processList = JSON.parse(yield util_1.promisify(fs_1.readFile)(this.processListFile, { encoding }));
            }
            catch (e) { }
            const [currentProcess] = processList.filter(p => p.repoPath === process.cwd());
            if (helpers_1.includes('--all') && processList.length) {
                yield util_1.promisify(fs_1.writeFile)(this.processListFile, JSON.stringify([]), {
                    encoding
                });
            }
            else if (currentProcess) {
                yield util_1.promisify(fs_1.writeFile)(this.processListFile, JSON.stringify(processList.filter(p => p.repoPath !== process.cwd())), { encoding });
            }
            else if (helpers_1.includes('--link-name') && processList.length) {
                const linkName = helpers_1.nextOrDefault('--link-name');
                yield util_1.promisify(fs_1.writeFile)(this.processListFile, JSON.stringify(processList.filter(p => p.linkName !== linkName)), { encoding });
            }
            console.log(`Project unlinked ${process.cwd()} link name: ${currentProcess.linkName}`);
        });
        this.clean = () => __awaiter(this, void 0, void 0, function* () {
            const isRunning = yield this.isDaemonRunning();
            if (!isRunning) {
                yield util_1.promisify(rimraf)(this.daemonFolder);
            }
            else {
                console.log('Cannot perform clean operation while daemon is running execute `gapi daemon stop` and try again');
            }
            console.log(`${this.daemonFolder} cleaned!`);
        });
        this.genericRunner = (task) => args => this[task](args || helpers_1.nextOrDefault(task, ''));
        this.tasks = new Map([
            [exports.DaemonTasks.start, this.genericRunner(exports.DaemonTasks.start)],
            [exports.DaemonTasks.stop, this.genericRunner(exports.DaemonTasks.stop)],
            [exports.DaemonTasks.clean, this.genericRunner(exports.DaemonTasks.clean)],
            [exports.DaemonTasks.kill, this.genericRunner(exports.DaemonTasks.kill)],
            [exports.DaemonTasks.bootstrap, this.genericRunner(exports.DaemonTasks.bootstrap)],
            [exports.DaemonTasks.link, this.genericRunner(exports.DaemonTasks.link)],
            [exports.DaemonTasks.unlink, this.genericRunner(exports.DaemonTasks.unlink)],
            [exports.DaemonTasks.list, this.genericRunner(exports.DaemonTasks.list)],
            [exports.DaemonTasks.status, this.genericRunner(exports.DaemonTasks.status)],
        ]);
        this.bootstrap = (options) => __awaiter(this, void 0, void 0, function* () {
            return yield this.bootstrapTask.run(options);
        });
    }
    readGapiConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let file = {};
            try {
                file = yamljs_1.load(process.cwd() + '/gapi-cli.conf.yml');
            }
            catch (e) { }
            return file;
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
            if (helpers_1.includes(exports.DaemonTasks.restart)) {
                return yield this.tasks.get(exports.DaemonTasks.restart)();
            }
            if (helpers_1.includes(exports.DaemonTasks.status)) {
                return yield this.tasks.get(exports.DaemonTasks.status)();
            }
            if (helpers_1.includes(exports.DaemonTasks.stop)) {
                console.log(`Stopping daemon! Garbage is inside ${this.daemonFolder}!`);
                return yield this.tasks.get(exports.DaemonTasks.stop)();
            }
            if (helpers_1.includes(exports.DaemonTasks.kill)) {
                return yield this.tasks.get(exports.DaemonTasks.kill)();
            }
            if (helpers_1.includes(exports.DaemonTasks.unlink)) {
                return yield this.tasks.get(exports.DaemonTasks.unlink)();
            }
            if (helpers_1.includes(exports.DaemonTasks.link)) {
                return yield this.tasks.get(exports.DaemonTasks.link)();
            }
            if (helpers_1.includes(exports.DaemonTasks.list)) {
                core_1.Container.reset(core_2.HAPI_SERVER);
                core_1.Container.set(core_2.HAPI_SERVER, { info: { port: '42000' } });
                return yield this.tasks.get(exports.DaemonTasks.list)();
            }
            if (helpers_1.includes(exports.DaemonTasks.bootstrap)) {
                return yield this.tasks.get(exports.DaemonTasks.bootstrap)({
                    server: {
                        hapi: {
                            port: 42000
                        }
                    },
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
            if (yield this.isDaemonRunning()) {
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
    isDaemonRunning() {
        return __awaiter(this, void 0, void 0, function* () {
            const pid = yield this.readPidDaemonConfig();
            if (!pid) {
                console.log('Daemon is not running!');
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
    core_1.Service()
], DaemonTask);
exports.DaemonTask = DaemonTask;

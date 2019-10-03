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
const args_service_1 = require("../core/services/args.service");
const config_service_1 = require("../core/services/config.service");
const environment_service_1 = require("../core/services/environment.service");
const exec_service_1 = require("../core/services/exec.service");
const fs_1 = require("fs");
const Bundler = require("parcel-bundler");
const childProcess = require("child_process");
const helpers_1 = require("../core/helpers");
const core_2 = require("@gapi/core");
const core_3 = require("@gapi/core");
const path_1 = require("path");
const util_1 = require("util");
let StartTask = class StartTask {
    constructor() {
        this.argsService = core_1.Container.get(args_service_1.ArgsService);
        this.configService = core_1.Container.get(config_service_1.ConfigService);
        this.environmentService = core_1.Container.get(environment_service_1.EnvironmentVariableService);
        this.execService = core_1.Container.get(exec_service_1.ExecService);
        this.verbose = '';
        this.quiet = true;
    }
    run(stop = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.argsService.args.includes('--verbose')) {
                this.verbose = ' --verbose';
                this.quiet = false;
            }
            this.configService.config.config.app =
                this.configService.config.config.app || {};
            if (this.argsService.args[3] && this.argsService.args[3].includes('--')) {
                const currentConfigKey = this.argsService.args[3].replace('--', '');
                const currentConfiguration = this.configService.config.config.app[currentConfigKey];
                if (currentConfiguration &&
                    currentConfiguration.prototype &&
                    currentConfiguration.prototype === String &&
                    currentConfiguration.includes('extends')) {
                    this.config = this.environmentService.setVariables(this.extendConfig(currentConfiguration));
                    this.configOriginal = this.extendConfig(currentConfiguration);
                    console.log(`'${currentConfigKey}' configuration loaded!`);
                }
                else if (currentConfiguration) {
                    this.config = this.environmentService.setVariables(currentConfiguration);
                    this.configOriginal = currentConfiguration;
                }
                else {
                    this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
                    this.configOriginal = this.configService.config.config.app.local;
                }
                console.log(`'${currentConfigKey}' configuration loaded!`);
            }
            else {
                const currentConfiguration = (this.configService.config.config.app.local);
                if (currentConfiguration &&
                    currentConfiguration.prototype &&
                    currentConfiguration.prototype === String &&
                    currentConfiguration.includes('extends')) {
                    this.config = this.environmentService.setVariables(this.extendConfig(currentConfiguration));
                    this.configOriginal = this.extendConfig(currentConfiguration);
                }
                else {
                    this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
                    this.configOriginal = this.configService.config.config.app.local;
                }
                console.log(`'local' configuration loaded!`);
            }
            const sleep = process.argv[5] ? `${process.argv[5]} &&` : '';
            const cwd = process.cwd();
            const htmlFile = fs_1.existsSync(`${cwd}/src/index.html`);
            const customPath = process.argv[4]
                ? process.argv[4].split('--path=')[1]
                : null;
            const customPathExists = yield util_1.promisify(fs_1.exists)(`${cwd}/${customPath}`);
            const isLintEnabled = this.argsService.args.toString().includes('--lint');
            if (this.argsService.args.toString().includes('--docker')) {
                return yield this.execService.call(`${this.config} && pm2-docker ${cwd}/${customPathExists ? customPath : 'process.yml'} --only APP`);
            }
            else if (this.argsService.args.toString().includes('--pm2')) {
                if (!stop.state) {
                    return yield this.execService.call(`${this.config} && pm2 stop ${cwd}/${customPathExists ? customPath : 'process.yml'}`);
                }
                else {
                    return yield this.execService.call(`${this.config} && pm2 start ${cwd}/${customPathExists ? customPath : 'process.yml'} --only APP`);
                }
            }
            if (process.env.DEPLOY_PLATFORM === 'heroku') {
                if (customPathExists) {
                    return yield this.execService.call(`${sleep} ts-node ${cwd}/${customPathExists ? customPath : 'index.ts'}`);
                }
                else {
                    return yield this.execService.call(`${sleep} ts-node ${cwd}/src/main.ts`);
                }
            }
            else if (process.argv.toString().includes('--ts-node')) {
                return yield this.execService.call(`nodemon --watch '${cwd}/src/**/*.ts' ${this.quiet ? '--quiet' : ''}  --ignore '${this.configService.config.config.schema.introspectionOutputFolder}/' --ignore '${cwd}/src/**/*.spec.ts' --exec '${this.config} && ${isLintEnabled ? 'npm run lint &&' : ''} ${sleep} ts-node' ${customPathExists
                    ? `${cwd}/${customPathExists ? customPath : 'index.ts'}`
                    : `${cwd}/src/main.ts`}  ${this.verbose}`);
            }
            else {
                if (htmlFile) {
                }
                let files;
                if (customPathExists) {
                    files = `${cwd}/${customPathExists ? customPath : 'index.ts'}`;
                }
                else if (htmlFile) {
                    process.argv.push('--target=browser');
                    process.argv.push('--bundle-modules');
                    process.argv.push('--hmr true');
                    files = `${cwd}/src/index.html`;
                }
                else {
                    files = `${cwd}/src/main.ts`;
                }
                return yield this.prepareBundler(files, {
                    original: this.configOriginal,
                    schema: this.configService.config.config.schema
                }, true, false);
            }
        });
    }
    isDaemonRunning() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setFakeHapiServer();
            let res = {};
            try {
                res = yield core_2.sendRequest({
                    query: `
                    query {
                        status {
                            status
                        }
                    }
                `
                });
            }
            catch (e) { }
            if (res.status === 200 && res.data.status.status === '200') {
                return true;
            }
            return false;
        });
    }
    setFakeHapiServer() {
        core_3.Container.set(core_2.HAPI_SERVER, { info: { port: '42000' } });
    }
    notifyDaemon(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setFakeHapiServer();
            yield core_2.sendRequest({
                query: `
            mutation notifyDaemon($repoPath: String!) {
              notifyDaemon(repoPath: $repoPath) {
                repoPath
              }
            }
            `,
                variables
            });
        });
    }
    prepareBundler(file, { original, schema }, start = helpers_1.includes('--start'), buildOnly = helpers_1.includes('--buildOnly=false') ? false : true, minify = helpers_1.includes('--minify=false') ? false : true, target = helpers_1.includes('--target=browser')
        ? 'browser'
        : 'node', excludedFolders = []) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file);
            if (schema.excludedFolders.length) {
                excludedFolders = [...excludedFolders, ...schema.excludedFolders];
            }
            if (schema.introspectionOutputFolder) {
                excludedFolders.push(schema.introspectionOutputFolder);
            }
            excludedFolders = excludedFolders.map(f => path_1.normalize(process.cwd() + f).replace('.', ''));
            const bundler = new Bundler(file, {
                target,
                outDir: helpers_1.nextOrDefault('--outDir', './dist'),
                minify,
                outFile: helpers_1.nextOrDefault('--outFile', null),
                // contentHash: true,
                // detailedReport: true,
                hmr: helpers_1.nextOrDefault('--hmr', false, v => Boolean(v)),
                publicUrl: helpers_1.nextOrDefault('--public-url', '/'),
                bundleNodeModules: helpers_1.includes('--bundle-modules')
            });
            const originalOnChange = bundler.onChange.bind(bundler);
            bundler.onChange = function (path) {
                if (excludedFolders.filter(d => path.substring(0, path.lastIndexOf('/')).includes(d)).length && !helpers_1.includes('--disable-excluded-folders')) {
                    return;
                }
                return originalOnChange(path);
            };
            let bundle = null;
            let child = null;
            // let isFirstTimeRun = true;
            const killChild = () => {
                child.stdout.removeAllListeners('data');
                child.stderr.removeAllListeners('data');
                child.removeAllListeners('exit');
                child.kill();
            };
            bundler.on('buildStart', () => __awaiter(this, void 0, void 0, function* () {
                if (child) {
                    killChild();
                }
            }));
            bundler.on('bundled', compiledBundle => (bundle = compiledBundle));
            bundler.on('buildEnd', () => __awaiter(this, void 0, void 0, function* () {
                if (buildOnly) {
                    process.stdout.write(`Gapi Application build finished! ${file}\n`);
                    process.stdout.write(`Bundle source: ${bundle.name}`);
                    process.exit(0);
                }
                //   const isDaemonInRunningcondition = await this.isDaemonRunning();
                //   if (!isFirstTimeRun && isDaemonInRunningcondition) {
                //     try {
                //       await this.notifyDaemon({ repoPath: process.cwd() });
                //     } catch (e) {}
                //   }
                if (start && bundle !== null) {
                    if (child) {
                        killChild();
                    }
                    if (helpers_1.includes('--lint')) {
                        let hasError = false;
                        try {
                            yield this.execService.call('npm run lint');
                        }
                        catch (e) {
                            hasError = true;
                        }
                        if (hasError) {
                            return;
                        }
                    }
                    else {
                        //   if (isDaemonInRunningcondition) {
                        //     await this.execService.call('sleep 1');
                        //   }
                    }
                    if (helpers_1.includes('--target=browser')) {
                        return;
                    }
                    const childArguments = [];
                    function defaultInspectConfig(type) {
                        console.log(`${type}=${helpers_1.nextOrDefault('--ihost', '127.0.0.1')}:${helpers_1.nextOrDefault('--iport', '9229')}`);
                        return `${type}=${helpers_1.nextOrDefault('--ihost', '127.0.0.1')}:${helpers_1.nextOrDefault('--iport', '9229')}`;
                    }
                    if (helpers_1.includes('--inspect-brk')) {
                        childArguments.push(defaultInspectConfig('--inspect-brk'));
                    }
                    else if (helpers_1.includes('--inspect')) {
                        childArguments.push(defaultInspectConfig('--inspect'));
                    }
                    process.env = Object.assign(process.env, original);
                    child = childProcess.spawn('node', [...childArguments, bundle.name]);
                    child.stdout.on('data', (data) => {
                        process.stdout.write(data);
                        // isFirstTimeRun = false;
                    });
                    child.stderr.on('data', data => process.stdout.write(data));
                    child.on('exit', code => {
                        console.log(`Child process exited with code ${code}`);
                        child = null;
                    });
                }
                bundle = null;
            }));
            if (helpers_1.includes('--target=browser') && !buildOnly) {
                yield bundler.serve();
            }
            else {
                yield bundler.bundle();
            }
        });
    }
    extendConfig(config) {
        const splitted = config.split(' ');
        const argum = splitted[1].split('/');
        const extendedConfiguration = this.configService.config.config[argum[0]][argum[1]];
        if (!extendedConfiguration) {
            throw new Error(`Cannot extend current configuration ${config}`);
        }
        return extendedConfiguration;
    }
};
StartTask = __decorate([
    core_1.Service()
], StartTask);
exports.StartTask = StartTask;

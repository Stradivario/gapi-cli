#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import { Container, Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services/config.service';
import { EnvironmentVariableService } from '../core/services/environment.service';
import { ExecService } from '../core/services/exec.service';

@Service()
export class StartTask {

    private argsService = Container.get(ArgsService);
    private configService: ConfigService = Container.get(ConfigService);
    private environmentService: EnvironmentVariableService = Container.get(EnvironmentVariableService);
    private execService: ExecService = Container.get(ExecService);
    private config: string;
    private verbose: string = '';
    private quiet: boolean = true;
    async run(stop: { state?: boolean } = {}) {
        if (this.argsService.args.includes('--verbose')) {
            this.verbose = ' --verbose';
            this.quiet = false;
        }
        if (this.argsService.args.toString().includes('--prod')) {
            this.config = this.environmentService.setVariables(this.configService.config.config.app.prod);
            if (this.argsService.args.toString().includes('--docker')) {
                await this.execService.call(`${this.config} && pm2-docker process.yml --only APP`);
            } else {
                if (!stop.state) {
                    await this.execService.call(`${this.config} && pm2 stop process.yml`);
                } else {
                    await this.execService.call(`${this.config} && pm2 start process.yml --only APP`);
                }
            }
        } else {
            if (this.argsService.args[3] && this.argsService.args[3].includes('--')) {
                const currentConfigKey = this.argsService.args[3].replace('--', '');
                const currentConfiguration = this.configService.config.config.app[currentConfigKey];
                if (currentConfiguration && currentConfiguration.prototype && currentConfiguration.prototype === String && currentConfiguration.includes('extends')) {
                    this.config = this.environmentService.setVariables(this.extendConfig(currentConfiguration));
                    console.log(`"${currentConfigKey}" configuration loaded!`);
                } else {
                    console.log(`"local" configuration loaded!`);
                    this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
                }
            } else {
                const currentConfiguration = <any>this.configService.config.config.app.local;
                if (currentConfiguration && currentConfiguration.prototype && currentConfiguration.prototype === String && currentConfiguration.includes('extends')) {
                    this.config = this.environmentService.setVariables(this.extendConfig(currentConfiguration));
                } else {
                    this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
                }
                console.log(`"local" configuration loaded!`);
            }
            const sleep = process.argv[4] ? `${process.argv[4]} &&` : '';
            if (process.env.DEPLOY_PLATFORM === 'heroku') {
                await this.execService.call(`${sleep} ts-node ${process.cwd()}/src/main.ts`);
            } else {
                await this.execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' ${this.quiet ? '--quiet' : ''}  --ignore '${this.configService.config.config.schema.introspectionOutputFolder}/' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec '${this.config} && npm run lint && ${sleep} ts-node' ${process.cwd()}/src/main.ts ${this.verbose}`);
            }
        }
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
}
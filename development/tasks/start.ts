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

    async run(stop: { state?: boolean } = {}) {
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
            this.config = this.environmentService.setVariables(this.configService.config.config.app.local);
            await this.execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec '${this.config} && ts-node' ${process.cwd()}/src/main.ts --verbose`);
        }
    }

}
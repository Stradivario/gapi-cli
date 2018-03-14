#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services/config.service';

@Service()
export class StartTask {

    private argsService = Container.get(ArgsService);
    private configService: ConfigService = Container.get(ConfigService);

    args: string;
    config: string;
    run(stop: { state?: boolean } = {}) {
        if (this.argsService.args.toString().includes('--prod')) {
            this.setVariables(this.configService.config.config.app.prod);
            if (this.argsService.args.toString().includes('--docker')) {
                exec(`${this.config} && pm2-docker process.yml --only APP`);
            } else {
                if (!stop.state) {
                    exec(`${this.config} && pm2 stop process.yml`);
                } else {
                    exec(`${this.config} && pm2 start process.yml --only APP`);
                }
            }
        } else {
            this.setVariables(this.configService.config.config.app.local);
            exec(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec '${this.config} && ts-node' ${process.cwd()}/src/main.ts --verbose`);
        }
    }
    setVariables(config) {
        this.config = ``;
        const conf = Object.keys(config);
        let count = 0;
        conf.forEach((key) => {
            count++;
            if (conf.length === count) {
                this.config += `export ${key}=${config[key]}`;
            } else {
                this.config += `export ${key}=${config[key]} && `;
            }
        });
    }
}
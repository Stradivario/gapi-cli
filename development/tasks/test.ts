#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services/config.service';
import { StartTask } from './start';


@Service()
export class ExecService {
    call(command: string, options?) {
        return new Promise((resolve, reject) => {
            exec(command, options, (e) => {
                if (e) {
                    reject(e);
                }
                resolve();
            });
        });
    }
}

const execService = Container.get(ExecService);


@Service()
export class TestTask {

    private argsService: ArgsService = Container.get(ArgsService);
    private configService: ConfigService = Container.get(ConfigService);
    private startTask: StartTask = Container.get(StartTask);

    args: string;
    config: string;
    async run() {
        this.args = this.argsService.args.toString();
        this.setConfig();
        this.setSleep();
        if (this.args.includes('--before')) {
            this.config += `&& export BEFORE_HOOK=true`;
            try {
                await execService.call(`${this.config} && ts-node ${process.cwd()}/src/test.ts`);
            } catch (e) {
                console.error(`ERROR: Terminal exited with STATUS ${e} tests will not be runned check src/test.ts, appropriate exit code is 0`);
                process.exit(1);
            }
            await execService.call(`${this.config} && jest`);
            console.log('SUCCESS');
        } else {
            if (this.args.includes('--watch')) {
                try {
                    await execService.call(`nodemon --watch '${process.cwd()}/src/**/*.ts' --exec '${this.config} && npm run lint && jest' --verbose`, { async: true });
                    // this.startTask.run();
                    // await execService.call(`${this.config} && jest --watchAll`);
                } catch (e) {
                    process.exit(1);
                }
            } else {
                try {
                    await execService.call(`${this.config} && npm run lint && jest`);
                } catch (e) {
                    process.exit(1);
                }
            }
            console.log('SUCCESS');
        }

    }

    setSleep() {
        this.config += ` && sleep 0 `;
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
    setConfig() {
        if (this.args.includes('--worker')) {
            this.setVariables(this.configService.config.config.test.worker);
        } else {
            this.setVariables(this.configService.config.config.test.local);
        }
        console.log(this.config);
    }
    validateConfig(key: string) {
        if (!this.configService.config.config.test[key]) {
            throw new Error('Missing test config inside gapi-cli.conf.yml');
        }
        if (!this.configService.config.config.test[key].db_host) {
            throw new Error('Missing variable db_host inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].db_name) {
            throw new Error('Missing variable db_name inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].db_pass) {
            throw new Error('Missing variable db_password inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].db_port) {
            throw new Error('Missing variable db_port inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].db_user) {
            throw new Error('Missing variable db_user inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].endpoint) {
            throw new Error('Missing variable endpoint inside gapi-cli.conf.yml');
        }

        if (!this.configService.config.config.test[key].token) {
            throw new Error('Missing variable token inside gapi-cli.conf.yml');
        }
    }
}
#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';

@Service()
export class StartTask {

    private argsService = Container.get(ArgsService);
    args: string;

    run(stop: {state?: boolean} = {}) {
        if (this.argsService.args.toString().includes('--prod')) {
            if (this.argsService.args.toString().includes('--docker')) {
                exec(`pm2-docker process.yml --only APP`)
            } else {
                if (!stop.state) {
                    exec(`pm2 stop process.yml`)
                } else {
                    exec(`pm2 start process.yml --only APP`);
                }
            }
        } else {
            exec(`nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec 'ts-node' ${process.cwd()}/src/main.ts --verbose`)
        }
    }

}
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

    run() {
        if (this.argsService.args.toString().includes('--prod')) {
            if (this.argsService.args.toString().includes('--docker')) {
                exec(`pm2-docker process.yml --only APP`)
            } else {
                exec(`pm2 start process.yml --only APP`);
            }
        } else {
            exec(`nodemon`)
        }
    }

}
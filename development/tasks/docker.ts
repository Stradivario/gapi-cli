#! /usr/bin/env node

import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services/config.service';

@Service()
export class DockerTask {

    private argsService: ArgsService = Container.get(ArgsService);
    private configService: ConfigService = Container.get(ConfigService);
    args: string;

    run() {

        if (this.argsService.args[3] === 'build') {
            exec(this.configService.config.commands.docker.build)
        }
        
        if (this.argsService.args[3] === 'start') {
            console.log(this.configService.config.commands.docker)
            exec(this.configService.config.commands.docker.start)
        }

        if (this.argsService.args[3] === 'stop') {
            exec(this.configService.config.commands.docker.stop)
        }
    }

    exec(command) {
        exec(command);
    }

}


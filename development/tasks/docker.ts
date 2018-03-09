#! /usr/bin/env node

import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';

@Service()
export class DockerTask {

    private argsService = Container.get(ArgsService);
    args: string;

    run() {
        Observable.from(this.argsService.args)
            .map(arg => {
                this.args += arg;
                if (arg === 'build') {
                    this.build();
                }
                
                if (arg === 'start') {
                    this.start();
                }

                if (arg === 'stop') {
                    this.stop();
                }
                return arg;
            })
            .subscribe()
    }

    exec() {
        exec(`git clone https://github.com/Stradivario/gapi-starter.git ${process.argv[2]} && cd ./${process.argv[2]} && npm install`);
    }


    start() {
        exec(
            `docker-compose up --force-recreate`
        );
    }

    stop() {
        exec(
            `docker stop ${process.argv[3]}`
        );
    }

    build() {
        exec(
            `docker build -t ${process.argv[3]} ${process.cwd()}`
        );
    }
}


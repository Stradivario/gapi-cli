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
        this.exec();
    }

    exec() {
        exec(
            `nodemon --watch '${process.cwd()}/src/**/*.ts' --ignore '${process.cwd()}/src/**/*.spec.ts' --exec 'ts-node' ${process.cwd()}/src/main.ts --verbose` 
        )
    }

}
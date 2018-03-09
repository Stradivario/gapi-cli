#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';

@Service()
export class NewTask {

    private argsService = Container.get(ArgsService);
    args: string;

    run() {
        this.exec();
    }

    exec() {
        exec(`git clone https://github.com/Stradivario/gapi-starter.git ${process.argv[3]} && cd ./${process.argv[3]} && npm install`);
    }

}
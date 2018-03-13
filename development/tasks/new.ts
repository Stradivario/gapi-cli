#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import Container, { Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';

@Service()
export class NewTask {

    private argsService: ArgsService = Container.get(ArgsService);
    args: string;
    repoLinks = {
        basic: 'https://github.com/Stradivario/gapi-starter',
        advanced: 'https://github.com/Stradivario/gapi-starter-postgres-sequelize'
    };
    run() {
        if (this.argsService.args.toString().includes('--advanced')) {
            this.exec(this.repoLinks.advanced);
        } else {
            this.exec(this.repoLinks.basic);
        }
    }

    exec(repoLink: string) {
        exec(`git clone ${repoLink} ${process.argv[3]} && cd ./${process.argv[3]} && npm install`);
    }

}
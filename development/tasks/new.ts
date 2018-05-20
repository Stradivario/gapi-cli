#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import { Service, Container } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ExecService } from '../core/services/exec.service';

@Service()
export class NewTask {

    private execService: ExecService = Container.get(ExecService);
    private argsService: ArgsService = Container.get(ArgsService);
    private repoLinks = {
        basic: 'https://github.com/Stradivario/gapi-starter',
        advanced: 'https://github.com/Stradivario/gapi-starter-postgres-sequelize',
        microservices: 'https://github.com/Stradivario/gapi-starter-microservices',
        serverless: 'https://github.com/Stradivario/gapi-starter-serverless',
        serverlessSequelize: 'https://github.com/Stradivario/gapi-starter-serverless-sequelize'
    };

    async run() {
        if (this.argsService.args.toString().includes('--advanced')) {
            await this.exec(this.repoLinks.advanced);
        } else if (this.argsService.args.toString().includes('--microservices')) {
            await this.exec(this.repoLinks.microservices);
        } else if (this.argsService.args.toString().includes('--serverless-sequelize')) {
            await this.exec(this.repoLinks.serverlessSequelize);
        } else if (this.argsService.args.toString().includes('--serverless')) {
            await this.exec(this.repoLinks.serverless);
        } else {
            await this.exec(this.repoLinks.basic, 'echo basic example uses ts-node and gapi-cli installed internally because of Heroku easy deployment button. To uninstall ts-node and gapi-cli type "npm uninstall ts-node gapi-cli"');
        }
    }

    async exec(repoLink: string, args = '') {
        await this.execService.call(`git clone ${repoLink} ${process.argv[3]} && cd ./${process.argv[3]} && npm install ${args ? `&& ${args}` : ''}`);
    }

}
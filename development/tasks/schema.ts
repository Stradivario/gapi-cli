#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import { Service, Container } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ExecService } from '../core/services/exec.service';
import { ConfigService } from '../core/services/config.service';
import { existsSync, mkdirSync } from 'fs';

@Service()
export class SchemaTask {

    private folder: string;
    private endpoint: string;
    private node_modules: string;
    private bashFolder: string;
    private execService: ExecService = Container.get(ExecService);
    private argsService: ArgsService = Container.get(ArgsService);
    private configService: ConfigService = Container.get(ConfigService);

    async run() {
        this.folder = this.configService.config.config.schema.introspectionOutputFolder;
        this.endpoint = this.configService.config.config.schema.introspectionEndpoint;
        this.node_modules = __dirname.replace('tasks', 'node_modules');
        this.bashFolder = __dirname.replace('tasks', 'bash');

        if (process.argv[3] === 'introspect') {
            if (!existsSync(this.folder)) {
                mkdirSync(this.folder);
            }
            await this.generateSchema();
        }

    }

    public async generateSchema() {
        await this.execService.call(`node ${this.node_modules}/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${this.folder}/schema.json`, { async: true });
        await this.execService.call(`node  ${this.bashFolder}/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/graphql.d.ts`, { async: true });
    }

}
#! /usr/bin/env node
import { exec } from 'shelljs';
import { RootService } from '../core/services/root.service';
import { Service, Container } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { Observable } from 'rxjs';
import { ExecService } from '../core/services/exec.service';
import { ConfigService } from '../core/services/config.service';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlink, unlinkSync } from 'fs';

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
            console.log(`Typings introspection based on GAPI Schema created inside folder: ${this.folder}/index.d.ts`);
        }

        if (process.argv[3] === 'collect' || this.argsService.args.includes('--collect-documents')) {
            if (!existsSync(this.folder)) {
                mkdirSync(this.folder);
            }
            await this.collectQueries();
            console.log(`Schema documents created inside folder: ${this.folder}/documents.json`);
        }
        console.log(`To change export folder for this command you need to check this link https://github.com/Stradivario/gapi-cli/wiki/schema`);
    }

    public async collectQueries() {
        await this.execService.call(`node ${this.node_modules}/graphql-document-collector/bin/graphql-document-collector '**/*.graphql' > ${this.folder}/documents-temp.json`);
        const readDocumentsTemp = readFileSync(`${this.folder}/documents-temp.json`, 'utf-8');
        if (this.argsService.args.includes('--collect-types')) {
            this.generateTypes(readDocumentsTemp);
        }
        unlinkSync(`${this.folder}/documents-temp.json`);
        const parsedDocuments = `/* tslint:disable */ \n export const DOCUMENTS = ${readDocumentsTemp}`;
        writeFileSync(`${this.folder}/documents.ts`, parsedDocuments, 'utf8');
    }

    public async generateSchema() {
        await this.execService.call(`node ${this.node_modules}/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${this.folder}/schema.json`, { async: true });
        await this.execService.call(`node  ${this.bashFolder}/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/index.d.ts`, { async: true });
    }

    public async generateTypes(readDocumentsTemp) {
        let types = 'export type DocumentTypes =\n | ';
        const documents = Object.keys(JSON.parse(readDocumentsTemp));
        let count = 3;
        documents.forEach(key => {
            count ++;
            const n = key.lastIndexOf('/');
            const result = key.substring(n + 1);

            if (result === 'Place.graphql' || result === 'Movie.graphql' || result === 'ListMovies.graphql') {
                return;
            }

            if (documents.length === count) {
                types += `'${result}';`;
            } else {
                types += `'${result}'\n | `;
            }
        });
        console.log(types);
        writeFileSync(`${this.folder}/documentTypes.ts`, types, 'utf8');
    }
}

type test = '';
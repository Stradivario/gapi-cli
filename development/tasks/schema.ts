#! /usr/bin/env node
import { Service, Container } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { ExecService } from '../core/services/exec.service';
import { ConfigService } from '../core/services/config.service';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlink,
  unlinkSync
} from 'fs';

@Service()
export class SchemaTask {
  private folder: string;
  private endpoint: string;
  private node_modules: string;
  private bashFolder: string;
  private pattern: string;
  private execService: ExecService = Container.get(ExecService);
  private argsService: ArgsService = Container.get(ArgsService);
  private configService: ConfigService = Container.get(ConfigService);

  async run() {
    this.folder = this.configService.config.config.schema.introspectionOutputFolder;
    this.endpoint = this.configService.config.config.schema.introspectionEndpoint;
    this.pattern = this.configService.config.config.schema.pattern;
    this.node_modules = __dirname.replace('tasks', 'node_modules');
    this.bashFolder = __dirname.replace('tasks', 'bash');

    if (process.argv[3] === 'introspect') {
      this.createDir();
      await this.generateSchema();
      console.log(
        `Typings introspection based on GAPI Schema created inside folder: ${
          this.folder
        }/index.d.ts`
      );
    }

    if (
      process.argv[3] === 'collect' ||
      this.argsService.args.includes('--collect-documents')
    ) {
      this.createDir();
      await this.collectQueries();
      console.log(
        `Schema documents created inside folder: ${this.folder}/documents.json`
      );
    }
    console.log(
      `To change export folder for this command you need to check this link https://github.com/Stradivario/gapi-cli/wiki/schema`
    );
  }
  private createDir() {
    if (!existsSync(this.folder)) {
      mkdirSync(this.folder);
    }
  }
  public async collectQueries() {
    await this.execService.call(
      `node ${
        this.node_modules
      }/graphql-document-collector/bin/graphql-document-collector '${
        this.pattern ? this.pattern : '**/*.graphql'
      }' > ${this.folder}/documents-temp.json`
    );
    const readDocumentsTemp = readFileSync(
      `${this.folder}/documents-temp.json`,
      'utf-8'
    );
    if (this.argsService.args.includes('--collect-types')) {
      this.generateTypes(readDocumentsTemp);
    }
    const parsedDocuments = `/* tslint:disable */ \n export const DOCUMENTS = ${readDocumentsTemp}`;
    writeFileSync(`${this.folder}/documents.ts`, parsedDocuments, 'utf8');
    unlinkSync(`${this.folder}/documents-temp.json`);
  }

  public async generateSchema() {
    await this.execService.call(
      `export NODE_TLS_REJECT_UNAUTHORIZED=0 && node ${
        this.node_modules
      }/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${
        this.folder
      }/schema.json`,
      { async: true }
    );
    await this.execService.call(
      `export NODE_TLS_REJECT_UNAUTHORIZED=0 && node  ${
        this.bashFolder
      }/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/index.ts`,
      { async: true }
    );
  }

  public async generateTypes(readDocumentsTemp) {

    const savedDocuments = [];
    Object.keys(JSON.parse(readDocumentsTemp)).forEach(key => {
      const n = key.lastIndexOf('/');
      const result = key.substring(n + 1);
      if (result === 'ListMovies.graphql') {
        return;
      }
      if (result === 'Place.graphql') {
        return;
      }
      if (result === 'Movie.graphql') {
        return;
      }
      savedDocuments.push(result);
    });

    const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const DocumentTypes = strEnum(${JSON.stringify(savedDocuments).replace(/"/g, `'`).replace(/,/g, ',\n')});
export type DocumentTypes = keyof typeof DocumentTypes;`;
    writeFileSync(`${this.folder}/documentTypes.ts`, types, 'utf8');
  }
}

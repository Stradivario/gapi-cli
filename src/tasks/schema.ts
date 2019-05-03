import { Service, Container, createUniqueHash } from '@rxdi/core';
import { ArgsService } from '../core/services/args.service';
import { ExecService } from '../core/services/exec.service';
import { ConfigService } from '../core/services/config.service';
import { exists, readFile, writeFile, unlink } from 'fs';
import { promisify } from 'util';
import { homedir } from 'os';
const { mkdirp } = require('@rxdi/core/dist/services/file/dist');

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
  private gapiFolder: string = `${homedir()}/.gapi`;
  private daemonFolder: string = `${this.gapiFolder}/daemon`;
  private cacheFolder: string = `${this.daemonFolder}/.cache`;

  async run(
    introspectionEndpoint?: string,
    introspectionOutputFolder?: string,
    pattern?: string
  ) {
    const originalConsole = console.log.bind(console);
    console.log = function() {
      return originalConsole.apply(console, [
        '\x1b[36m%s\x1b[0m',
        `${process.cwd()} =>`,
        ...arguments
      ]);
    };
    this.folder =
      introspectionOutputFolder ||
      this.configService.config.config.schema.introspectionOutputFolder;
    this.endpoint =
      introspectionEndpoint ||
      this.configService.config.config.schema.introspectionEndpoint;
    this.pattern = pattern || this.configService.config.config.schema.pattern;
    this.node_modules = __dirname.replace('dist/tasks', 'node_modules');
    this.bashFolder = __dirname.replace('dist/tasks', 'bash');

    if (process.argv[3] === 'introspect') {
      await this.createDir();
      if (!await this.generateSchema()) {
        return
      }
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
      await this.createDir();
      await this.collectQueries();
      console.log(
        `Schema documents created inside folder: ${this.folder}/documents.json`
      );
    }
    console.log(
      `To change export folder for this command you need to check this link https://github.com/Stradivario/gapi-cli/wiki/schema`
    );
  }
  private async createDir() {
    if (!(await promisify(exists)(this.folder))) {
      await promisify(mkdirp)(this.folder);
    }
    await promisify(mkdirp)(this.cacheFolder);
  }
  public async collectQueries() {
    const randomString = Math.random().toString(36).substring(2);
    await this.execService.call(
      `node ${
        this.node_modules
      }/graphql-document-collector/bin/graphql-document-collector '${
        this.pattern ? this.pattern : '**/*.graphql'
      }' > ${this.cacheFolder}/${randomString}.json`,
      { async: true }
    );
    const readDocumentsTemp = await promisify(readFile)(
      `${this.cacheFolder}/${randomString}.json`,
      'utf-8'
    );
    await promisify(unlink)(`${this.cacheFolder}/${randomString}.json`);
    if (this.argsService.args.includes('--collect-types')) {
      await this.generateTypes(readDocumentsTemp);
    }
    const parsedDocuments = `/* tslint:disable */ \n export const DOCUMENTS = ${readDocumentsTemp};`;
    await promisify(writeFile)(
      `${this.folder}/documents.ts`,
      parsedDocuments,
      'utf8'
    );
  }

  /*
   Will create integrity cache so it will trigger build every time
   Following folder structure will be created
   ~/.gapi/daemon/.cache/${repoPathIntegrityKey}/${schemaIntegrityKey}
   File
  */
  private async cacheSchemaIntegrity(folder: string) {
    const schemaInterface = await promisify(readFile)(folder, { encoding: 'utf8' });
    const folderCacheIntegrity = createUniqueHash(folder);
    const schemaCacheIntegrity = createUniqueHash(schemaInterface);
    const cacheIntegrityFolder = `${this.cacheFolder}/schema/${folderCacheIntegrity}`;
    await promisify(mkdirp)(cacheIntegrityFolder);
    await promisify(writeFile)(`${cacheIntegrityFolder}/${schemaCacheIntegrity}.ts`, schemaInterface, { encoding: 'utf8' });
    console.log(schemaCacheIntegrity);
  }

  private async isSchemaCached(folder: string) {
    const schemaInterface = await promisify(readFile)(folder, { encoding: 'utf8' });
    const folderCacheIntegrity = createUniqueHash(folder);
    const schemaCacheIntegrity = createUniqueHash(schemaInterface);
    const cacheIntegrityFolder = `${this.cacheFolder}/schema/${folderCacheIntegrity}`;
    return await promisify(exists)(`${cacheIntegrityFolder}/${schemaCacheIntegrity}.ts`);
  }

  public async generateSchema() {
    console.log(`Trying to hit ${this.endpoint} ...`);
    await this.execService.call(
      `export NODE_TLS_REJECT_UNAUTHORIZED=0 && node ${
        this.node_modules
      }/apollo-codegen/lib/cli.js introspect-schema ${this.endpoint} --output ${
        this.folder
      }/schema.json`,
      { async: true }
    );
    let returnResult: boolean = true;
    try {
      if (await this.isSchemaCached(`${this.folder}/schema.json`)) {
        return returnResult = false;
      }
      await this.cacheSchemaIntegrity(`${this.folder}/schema.json`);
    } catch(e) {}
    console.log(`Endpoint ${this.endpoint} hit!`);
    await this.execService.call(
      `export NODE_TLS_REJECT_UNAUTHORIZED=0 && node  ${
        this.bashFolder
      }/gql2ts/index.js ${this.folder}/schema.json -o ${this.folder}/index.ts`,
      { async: true }
    );
    return returnResult;
  }

  public async generateTypes(readDocumentsTemp) {
    const savedDocuments = Object.keys(JSON.parse(readDocumentsTemp))
      .map(key => {
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
        return result;
      }).filter(i => !!i);
    const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const DocumentTypes = strEnum(${JSON.stringify(savedDocuments)
      .replace(/"/g, `'`)
      .replace(/,/g, ',\n')});
export type DocumentTypes = keyof typeof DocumentTypes;`;
    return await promisify(writeFile)(
      `${this.folder}/documentTypes.ts`,
      types,
      'utf8'
    );
  }
}

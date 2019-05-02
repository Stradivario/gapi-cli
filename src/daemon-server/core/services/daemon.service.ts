import { Service } from '@rxdi/core';
import { exists, writeFile, readFile } from 'fs';
import { promisify } from 'util';
import { ILinkListType, IServerMetadataType } from '../../api-introspection';
import { from, of, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ListService } from './list.service';
import { ChildService } from './child.service';
import { homedir } from 'os';
const { mkdirp } = require('@rxdi/core/dist/services/file/dist');

@Service()
export class DaemonService {
  private noop = of([] as ILinkListType[]);
  private gapiFolder: string = `${homedir()}/.gapi`;
  private daemonFolder: string = `${this.gapiFolder}/daemon`;
  private processListFile: string = `${this.daemonFolder}/process-list`;
  constructor(
    private listService: ListService,
    private childService: ChildService
  ) {}

  notifyDaemon(payload: ILinkListType) {
    return this.findByRepoPath(payload).pipe(
      tap(([mainNode]) => this.saveMainNode({ ...mainNode, serverMetadata: payload.serverMetadata })),
      switchMap(([repo]) => this.findByLinkName(repo)),
      switchMap(otherRepos =>
        combineLatest([
          this.trigger(payload),
          ...otherRepos.map(r =>
            this.trigger(this.mergeServerMetadata(r, payload.serverMetadata))
          )
        ])
      ),
      map(() => payload)
    );
  }

  private async trigger(payload: ILinkListType): Promise<ILinkListType> {
    if (!(await promisify(exists)(payload.repoPath))) {
      await promisify(mkdirp)(payload.repoPath);
    }
    const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
    if (!(await promisify(exists)(gapiLocalConfig))) {
      await this.writeGapiCliConfig(gapiLocalConfig, payload);
    }
    const args = [
      'schema',
      'introspect',
      '--collect-documents',
      '--collect-types'
    ];
    await this.childService.spawn('gapi', args, payload.repoPath);
    return payload;
  }

  private async saveMainNode(payload: ILinkListType) {
    let processList: ILinkListType[] = [];
    const encoding = 'utf8';
    try {
      processList = JSON.parse(
        await promisify(readFile)(this.processListFile, { encoding })
      );
    } catch (e) {}
    await promisify(writeFile)(
      this.processListFile,
      JSON.stringify(
        processList
          .filter(p => p.repoPath !== payload.repoPath)
          .concat(payload)
      ),
      { encoding }
    );
  }
  private async writeGapiCliConfig(gapiLocalConfig, payload: ILinkListType) {
      let port = 9000;
      if (payload.serverMetadata.port) {
        port = payload.serverMetadata.port;
        await this.saveMainNode(payload);
      }
    return await promisify(writeFile)(
      gapiLocalConfig,
      `
config:
  schema:
    introspectionEndpoint: http://localhost:${port}/graphql
    introspectionOutputFolder: ./api-introspection
`
    );
  }
  private findByRepoPath(payload: ILinkListType) {
    return from(this.listService.readList()).pipe(
      switchMap(list =>
        list.length
          ? this.listService.findByRepoPath(payload.repoPath)
          : this.noop
      )
    );
  }
  private findByLinkName(repo: ILinkListType) {
    return repo && repo.linkName
      ? this.listService.findByLinkName(repo.linkName).exclude(repo.repoPath)
      : this.noop;
  }

  private mergeServerMetadata(
    repo: ILinkListType,
    serverMetadata: IServerMetadataType
  ) {
    return { ...repo, serverMetadata };
  }
}

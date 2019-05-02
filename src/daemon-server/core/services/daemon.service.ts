import { Service } from '@rxdi/core';
import { exists, writeFile } from 'fs';
import { promisify } from 'util';
import { ILinkListType } from '../../api-introspection';
import { from, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ListService } from './list.service';
import { ChildService } from './child.service';
const { mkdirp } = require('@rxdi/core/dist/services/file/dist');

@Service()
export class DaemonService {
  constructor(
    private listService: ListService,
    private childService: ChildService
  ) {}
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
  private writeGapiCliConfig(gapiLocalConfig, payload: ILinkListType) {
    const port = payload.serverMetadata.port ? payload.serverMetadata.port : '9000';
    return promisify(writeFile)(
      gapiLocalConfig,
      `
config:
  schema:
    introspectionEndpoint: http://localhost:${port}/graphql
    introspectionOutputFolder: ./api-introspection
`
    );
  }

  notifyDaemon(payload: ILinkListType) {
    return from(this.listService.readList()).pipe(
      switchMap(list =>
        list.length
          ? this.listService.findByRepoPath(payload.repoPath)
          : of([] as ILinkListType[])
      ),
      switchMap(([repo]) =>
        repo && repo.linkName
          ? this.listService
              .findByLinkName(repo.linkName)
              .exclude(repo.repoPath)
          : of([] as ILinkListType[])
      ),
      switchMap(otherRepos =>
        combineLatest([
          this.trigger(payload),
          ...otherRepos.map(r => this.trigger({ ...r, serverMetadata: payload.serverMetadata }))
        ])
      ),
      map(() => payload)
    );
  }
}

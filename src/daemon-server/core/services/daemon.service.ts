import { Service } from '@rxdi/core';
import { exists, writeFile } from 'fs';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { ILinkListType } from '../../api-introspection';
import { from, of, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ListService } from './list.service';

@Service()
export class DaemonService {
  constructor(private listService: ListService) {}
  private trigger(payload: ILinkListType): Promise<ILinkListType> {
    return new Promise(async (resolve, reject) => {
      const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
      const args = [
        'schema',
        'introspect',
        '--collect-documents',
        '--collect-types'
      ];
      if (!(promisify(exists)(gapiLocalConfig))) {
        await this.writeGapiCliConfig(gapiLocalConfig);
      }
      const child = spawn('gapi', args, { cwd: payload.repoPath, detached: true });
      const timeout = setTimeout(() => {
        child.kill('Schema introspection exited with timeout after 20 seconds');
        reject(payload);
        clearTimeout(timeout);
      }, 20 * 1000);
      child.stdout.on('data', data => process.stdout.write(data));
      child.stderr.on('data', data => process.stderr.write(data));
      child.on('close', code => {
        clearTimeout(timeout);
        if (!code) {
          resolve(payload);
        } else {
          reject(payload);
        }
      });
    });
  }

  writeGapiCliConfig(gapiLocalConfig: string) {
    return promisify(writeFile)(
      gapiLocalConfig,
      `
config:
schema:
  introspectionEndpoint: http://localhost:9000/graphql
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
          ...otherRepos.map(r => this.trigger(r))
        ])
      ),
      map(() => payload)
    );
  }
}

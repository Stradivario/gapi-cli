import { Service } from '@rxdi/core';
import { exists, writeFile } from 'fs';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { ILinkListType } from '../../api-introspection';

@Service()
export class DaemonService {
  trigger(payload: ILinkListType): Promise<ILinkListType> {
    return new Promise(async (resolve, reject) => {
      const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
      const args = [
        'schema',
        'introspect',
        '--collect-documents',
        '--collect-types'
      ];
      if (!(await promisify(exists)(gapiLocalConfig))) {
        await this.writeGapiCliConfig(gapiLocalConfig);
      }
      const child = spawn('gapi', args, { cwd: payload.repoPath });
      child.stdout.on('data', data => process.stdout.write(data));
      child.stderr.on('data', data => process.stderr.write(data));
      child.on('close', code => {
        if (!code) {
          resolve(payload);
        } else {
          reject(payload);
        }
      });
    });
  }

  writeGapiCliConfig(gapiLocalConfig: string) {
    return promisify(writeFile)(gapiLocalConfig, 
`
config:
schema:
  introspectionEndpoint: http://localhost:9000/graphql
  introspectionOutputFolder: ./api-introspection
`
    )
  }
}

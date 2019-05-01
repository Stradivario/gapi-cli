import { Service } from '@rxdi/core';
import { exists } from 'fs';
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
        args.push(`--url http://localhost:9000/graphql`);
        args.push(`--folder ./api-introspection`);
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
}

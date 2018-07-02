import { Service } from '@rxdi/core';
import { exec } from 'shelljs';

@Service()
export class ExecService {
    call(command: string, options?) {
        return new Promise((resolve, reject) => {
            exec(command, options, (e) => {
                if (e) {
                    reject(e);
                }
                resolve();
            });
        });
    }
}
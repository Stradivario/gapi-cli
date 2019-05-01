const service = require('service-systemd')
import { Service } from '@rxdi/core';
import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';

interface SystemDServiceInterface {
    name: string;
    cwd: string;
    app: string;
    env?: {
        [key: string]: any;
    };
    engine: 'node' | 'forever' | 'pm2';
}

@Service()
export class SystemDService {
    private gapiFolder: string = `${homedir()}/.gapi`;
    private daemonFolder: string = `${this.gapiFolder}/daemon`;
    private services: SystemDServiceInterface[] = this.readServicesFile();

    private readServicesFile() {
        let file: SystemDServiceInterface[] = [];
        try {
            file = JSON.parse(readFileSync(`${this.daemonFolder}/services`, { encoding: 'utf8' }));
        } catch (e) {}
        return file;
    }

    async remove(name: string) {
        await service.remove(name);
    }

    async register(options: SystemDServiceInterface) {
        await service.add(options);
        this.services.push(options);
        writeFileSync(`${this.daemonFolder}/services`, JSON.stringify(this.services), { encoding: 'utf8' });
    }

}

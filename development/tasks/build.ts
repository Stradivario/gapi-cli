#! /usr/bin/env node
import { Container, Service } from 'typedi';
import { ArgsService } from '../core/services/args.service';
import { ConfigService, MainConfig } from '../core/services/config.service';
import { EnvironmentVariableService } from '../core/services/environment.service';
import { ExecService } from '../core/services/exec.service';
import { existsSync } from 'fs';
import Bundler = require('parcel-bundler');
import childProcess = require('child_process');
import { StartTask } from './start';

@Service()
export class BuildTask {

    private startTask = Container.get(StartTask);
    private configService: ConfigService = Container.get(ConfigService);

    async run() {
        const cwd = process.cwd();
        const customPath = process.argv[4] ? process.argv[4].split('--path=')[1] : null;
        const customPathExists = existsSync(`${cwd}/${customPath}`);
        this.startTask.prepareBundler(`${customPathExists ? `${cwd}/${customPathExists ? customPath : 'index.ts'}` : `${cwd}/src/main.ts`}`, this.configService.config.config.app.local);
    }

}
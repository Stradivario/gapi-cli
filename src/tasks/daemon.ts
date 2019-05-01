import { Container, Service } from '@rxdi/core';
import { openSync, writeFile, readFile } from 'fs';
import { spawn } from 'child_process';
import mkdirp = require('mkdirp');
import { homedir } from 'os';
import { promisify } from 'util';
import * as rimraf from 'rimraf';
import { getProcessList } from '../core/helpers/ps-list';
import { strEnum } from '../core/helpers/stringEnum';
import { nextOrDefault, includes } from '../core/helpers';
import { BootstrapTask } from './bootstrap';
import { CoreModuleConfig, HAPI_SERVER } from '@gapi/core';
import { SystemDService } from '../core/services/systemd.service';
import { DaemonExecutorService } from '../core/services/daemon-executor/daemon-executor.service';

import { load } from 'yamljs';
import { GapiConfig } from '../core/services/config.service';
import { ILinkListType } from '../daemon-server/api-introspection/index';

export const DaemonTasks = strEnum([
  'start',
  'stop',
  'clean',
  'kill',
  'bootstrap',
  'link',
  'unlink',
  'list',
  'restart',
  'status'
]);
export type DaemonTasks = keyof typeof DaemonTasks;

@Service()
export class DaemonTask {
  private gapiFolder: string = `${homedir()}/.gapi`;
  private daemonFolder: string = `${this.gapiFolder}/daemon`;
  private outLogFile: string = `${this.daemonFolder}/out.log`;
  private errLogFile: string = `${this.daemonFolder}/err.log`;
  private pidLogFile: string = `${this.daemonFolder}/pid`;
  private processListFile: string = `${this.daemonFolder}/process-list`;
  private bootstrapTask: BootstrapTask = Container.get(BootstrapTask);
  private systemDService: SystemDService = Container.get(SystemDService);
  private daemonExecutorService: DaemonExecutorService = Container.get(
    DaemonExecutorService
  );
  private start = async (name?: string) => {
    await this.killDaemon();
    await promisify(mkdirp)(this.daemonFolder);
    if (includes('--systemd')) {
      await this.systemDService.register({
        name: name || 'my-node-service',
        cwd: __dirname.replace('tasks', 'core/helpers/'),
        app: __dirname.replace('tasks', 'core/helpers/systemd-daemon.js'),
        engine: 'node',
        env: {}
      });
    } else {
      const child = spawn('gapi', ['daemon', 'bootstrap'], {
        detached: true,
        stdio: [
          'ignore',
          openSync(this.outLogFile, 'a'),
          openSync(this.errLogFile, 'a')
        ]
      });
      await promisify(writeFile)(this.pidLogFile, child.pid, {
        encoding: 'utf-8'
      });
      console.log('DAEMON STARTED!', `\nPID: ${child.pid}`);
      child.unref();
    }
  };

  private restart = async (name: string) => {
    await this.stop();
    await this.start();
  };

  private stop = async (name?: string) => {
    if (includes('--systemd')) {
      await this.systemDService.remove(name || 'my-node-service');
    } else {
      await this.killDaemon();
    }
  };

  private list = async () => {
    const linkList = await this.daemonExecutorService.getLinkList();
    console.log(linkList.data.getLinkList);
  };

  private kill = (pid: number) => process.kill(Number(pid));
  private status = async () => {
    console.log(`Daemon status: ${await this.isDaemonRunning() ? 'active' : 'stopped'}`)
  };

  private link = async (linkName: string = 'default') => {
    const encoding = 'utf-8';
    let config: GapiConfig = { config: { schema: {} } } as any;
    let processList: ILinkListType[] = [];
    try {
      processList = JSON.parse(
        await promisify(readFile)(this.processListFile, { encoding })
      );
    } catch (e) {}
    config = await this.readGapiConfig();
    const introspectionPath =
      config.config.schema.introspectionOutputFolder ||
      `${process.cwd()}/api-introspection`;
    linkName = config.config.schema.linkName || linkName;
    const currentRepoProcess = {
      repoPath: process.cwd(),
      introspectionPath,
      linkName
    };
    await promisify(writeFile)(
      this.processListFile,
      JSON.stringify(
        processList
          .filter(p => p.repoPath !== process.cwd())
          .concat(currentRepoProcess)
      ),
      { encoding }
    );
    console.log(
      `Project linked ${process.cwd()} link name: ${
        currentRepoProcess.linkName
      }`
    );
  };

  private async readGapiConfig() {
    let file: GapiConfig = {} as any;
    try {
      file = load(process.cwd() + '/gapi-cli.conf.yml');
    } catch (e) {}
    return file;
  }

  private unlink = async () => {
    let processList: ILinkListType[] = [];
    const encoding = 'utf-8';
    try {
      processList = JSON.parse(
        await promisify(readFile)(this.processListFile, { encoding })
      );
    } catch (e) {}
    const [currentProcess] = processList.filter(
      p => p.repoPath === process.cwd()
    );
    if (includes('--all') && processList.length) {
      await promisify(writeFile)(this.processListFile, JSON.stringify([]), {
        encoding
      });
    } else if (currentProcess) {
      await promisify(writeFile)(
        this.processListFile,
        JSON.stringify(processList.filter(p => p.repoPath !== process.cwd())),
        { encoding }
      );
    } else if (includes('--link-name') && processList.length) {
      const linkName = nextOrDefault('--link-name');
      await promisify(writeFile)(
        this.processListFile,
        JSON.stringify(processList.filter(p => p.linkName !== linkName)),
        { encoding }
      );
    }
    console.log(
      `Project unlinked ${process.cwd()} link name: ${currentProcess.linkName}`
    );
  };

  private clean = async () => {
    const isRunning = await this.isDaemonRunning();
    if (!isRunning) {
      await promisify(rimraf)(this.daemonFolder);
    } else {
      console.log(
        'Cannot perform clean operation while daemon is running execute `gapi daemon stop` and try again'
      );
    }
    console.log(`${this.daemonFolder} cleaned!`);
  };

  private genericRunner = (task: DaemonTasks) => args =>
    (this[task] as any)(args || nextOrDefault(task, ''));

  private tasks: Map<
    DaemonTasks | string,
    (args?: any) => Promise<void>
  > = new Map([
    [DaemonTasks.start, this.genericRunner(DaemonTasks.start)],
    [DaemonTasks.stop, this.genericRunner(DaemonTasks.stop)],
    [DaemonTasks.clean, this.genericRunner(DaemonTasks.clean)],
    [DaemonTasks.kill, this.genericRunner(DaemonTasks.kill)],
    [DaemonTasks.bootstrap, this.genericRunner(DaemonTasks.bootstrap)],
    [DaemonTasks.link, this.genericRunner(DaemonTasks.link)],
    [DaemonTasks.unlink, this.genericRunner(DaemonTasks.unlink)],
    [DaemonTasks.list, this.genericRunner(DaemonTasks.list)],
    [DaemonTasks.status, this.genericRunner(DaemonTasks.status)],
  ]);

  bootstrap = async (options: CoreModuleConfig) => {
    return await this.bootstrapTask.run(options);
  };

  async run() {
    if (includes(DaemonTasks.clean)) {
      console.log(`Cleaning daemon garbage inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.clean)();
    }
    if (includes(DaemonTasks.start)) {
      console.log(`Stating daemon! Garbage is inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.start)();
    }
    if (includes(DaemonTasks.restart)) {
      return await this.tasks.get(DaemonTasks.restart)();
    }
    if (includes(DaemonTasks.status)) {
      return await this.tasks.get(DaemonTasks.status)();
    }
    if (includes(DaemonTasks.stop)) {
      console.log(`Stopping daemon! Garbage is inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.stop)();
    }
    if (includes(DaemonTasks.kill)) {
      return await this.tasks.get(DaemonTasks.kill)();
    }
    if (includes(DaemonTasks.unlink)) {
      return await this.tasks.get(DaemonTasks.unlink)();
    }
    if (includes(DaemonTasks.link)) {
      return await this.tasks.get(DaemonTasks.link)();
    }
    if (includes(DaemonTasks.list)) {
      Container.reset(HAPI_SERVER);
      Container.set(HAPI_SERVER, { info: { port: '42000' } });
      return await this.tasks.get(DaemonTasks.list)();
    }
    if (includes(DaemonTasks.bootstrap)) {
      return await this.tasks.get(DaemonTasks.bootstrap)(<CoreModuleConfig>{
        server: {
          hapi: {
            port: 42000
          }
        },
        graphql: {
          openBrowser: false,
          graphiql: false,
          graphiQlPlayground: false
        }
      });
    }
    console.log('Missing command for Daemon');
  }

  private async killDaemon() {
    const pid = await this.readPidDaemonConfig();
    if (!pid) {
      console.log('Daemon is not running!');
      return;
    }
    if (await this.isDaemonRunning()) {
      console.log(`Daemon process ${pid} Killed!`);
      process.kill(pid);
    }
  }

  private async readPidDaemonConfig() {
    let pid: number;
    try {
      pid = Number(
        await promisify(readFile)(this.pidLogFile, { encoding: 'utf-8' })
      );
    } catch (e) {}
    return pid;
  }

  private async isDaemonRunning() {
    const pid = await this.readPidDaemonConfig();
    if (!pid) {
      console.log('Daemon is not running!');
      return false;
    }
    return !!(await this.getActiveDaemon(pid)).length;
  }

  private async getActiveDaemon(pid: number) {
    return (await getProcessList()).filter(p => p.pid === pid);
  }
}

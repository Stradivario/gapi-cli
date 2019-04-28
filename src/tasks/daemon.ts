import Container, { Service } from 'typedi';
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
import { CoreModuleConfig } from '@gapi/core';
import { SystemDService } from '../core/services/systemd.service';

export const DaemonTasks = strEnum(['start', 'stop', 'clean', 'kill', 'bootstrap']);
export type DaemonTasks = keyof typeof DaemonTasks;

@Service()
export class DaemonTask {
  private gapiFolder: string = `${homedir()}/.gapi`;
  private daemonFolder: string = `${this.gapiFolder}/daemon`;
  private outLogFile: string = `${this.daemonFolder}/out.log`;
  private errLogFile: string = `${this.daemonFolder}/err.log`;
  private pidLogFile: string = `${this.daemonFolder}/pid`;
  private bootstrapTask: BootstrapTask = Container.get(BootstrapTask);
  private systemDService: SystemDService = Container.get(SystemDService)
  private start = async () => {
    await this.killDaemon();
    await promisify(mkdirp)(this.daemonFolder);
    if (includes('--systemd')) {
      await this.systemDService.register({
        name: 'my-node-service',
        cwd: __dirname.replace('tasks', 'core/helpers/'),
        app: 'systemd-daemon.js',
        engine: 'node',
        env: {
          PORT_2: 3002,
        }
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

  private stop = async () => {
    if (includes('--systemd')) {
      await this.systemDService.remove('my-node-service');
    } else {
      await this.killDaemon();
    }
  };
  private kill = (pid: number) => process.kill(Number(pid));
  private clean = () => promisify(rimraf)(this.daemonFolder);
  async bootstrap(options: CoreModuleConfig) {
    return await this.bootstrapTask.run(options)
  }
  private genericRunner = (task: DaemonTasks) => (args) =>
    (this[task] as any)(args || nextOrDefault(task, ''));

  private tasks: Map<
    DaemonTasks | string,
    (args?: any) => Promise<void>
  > = new Map([
    [DaemonTasks.start, this.genericRunner(DaemonTasks.start)],
    [DaemonTasks.stop, this.genericRunner(DaemonTasks.stop)],
    [DaemonTasks.clean, this.genericRunner(DaemonTasks.clean)],
    [DaemonTasks.kill, this.genericRunner(DaemonTasks.kill)],
    [DaemonTasks.bootstrap, this.genericRunner(DaemonTasks.bootstrap)]
  ]);

  async run() {
    if (includes(DaemonTasks.clean)) {
      console.log(`Cleaning daemon garbage inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.clean)();
    }
    if (includes(DaemonTasks.start)) {
      console.log(`Stating daemon! Garbage is inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.start)();
    }
    if (includes(DaemonTasks.stop)) {
      console.log(`Stopping daemon! Garbage is inside ${this.daemonFolder}!`);
      return await this.tasks.get(DaemonTasks.stop)();
    }
    if (includes(DaemonTasks.kill)) {
      return await this.tasks.get(DaemonTasks.kill)();
    }
    if (includes(DaemonTasks.bootstrap)) {
      return await this.tasks.get(DaemonTasks.bootstrap)(<CoreModuleConfig>{
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
    if (await this.isDaemonRunning(pid)) {
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

  private async isDaemonRunning(pid: number) {
    if (!pid) {
      return false;
    }
    return !!(await this.getActiveDaemon(pid)).length;
  }

  private async getActiveDaemon(pid: number) {
    return (await getProcessList()).filter(p => p.pid === pid);
  }
}


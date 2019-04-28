import { Service } from 'typedi';
import { openSync, writeFile, readFile } from 'fs';
import { spawn } from 'child_process';
import mkdirp = require('mkdirp');
import { homedir } from 'os';
import { promisify } from 'util';
import * as rimraf from 'rimraf';
import { processList } from '../core/helpers/ps-list';
import { strEnum } from '../core/helpers/stringEnum';
import { nextOrDefault, includes } from '../core/helpers';

export const DaemonTasks = strEnum(['start', 'stop', 'clean', 'kill']);
export type DaemonTasks = keyof typeof DaemonTasks;

@Service()
export class DaemonTask {
  private gapiFolder: string = `${homedir()}/.gapi`;
  private daemonFolder: string = `${this.gapiFolder}/daemon`;
  private outLogFile: string = `${this.daemonFolder}/out.log`;
  private errLogFile: string = `${this.daemonFolder}/err.log`;
  private pidLogFile: string = `${this.daemonFolder}/pid`;

  private start = async () => {
    await this.killDaemon();
    await promisify(mkdirp)(this.daemonFolder);
    const child = spawn('sleep', ['5'], {
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
  };

  private stop = () => this.killDaemon();
  private kill = (pid: number) => process.kill(Number(pid));
  private clean = () => promisify(rimraf)(this.daemonFolder);

  private genericRunner = (task: DaemonTasks) => () =>
    (this[task] as any)(nextOrDefault(task, ''));

  private tasks: Map<
    DaemonTasks | string,
    (args?: any) => Promise<void>
  > = new Map([
    [DaemonTasks.start, this.genericRunner(DaemonTasks.start)],
    [DaemonTasks.stop, this.genericRunner(DaemonTasks.stop)],
    [DaemonTasks.clean, this.genericRunner(DaemonTasks.clean)],
    [DaemonTasks.kill, this.genericRunner(DaemonTasks.kill)]
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
    console.log('Missing command for Daemon');
  }

  private async killDaemon() {
    const pid = await this.readPidDaemonConfig();
    if (!pid) {
      console.log('Daemon is not running!');
      return;
    }
    if (await this.isDaemonRunning(pid)) {
      process.kill(pid);
      console.log(`Daemon process ${pid} Killed!`);
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
    return (await this.getActiveDaemon(pid)).length;
  }

  private async getActiveDaemon(pid: number) {
    return (await processList()).filter(p => p.pid === pid);
  }
}

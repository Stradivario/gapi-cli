import { Container, Service } from '@rxdi/core';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { ArgsService } from '../services/args.service';
import { NewTask } from '../../tasks/new';
import { ConfigService } from './config.service';
import { TestTask } from '../../tasks/test';
import { SchemaTask } from '../../tasks/schema';
import { DeployTask } from '../../tasks/deploy';
import { BuildTask } from '../../tasks/build';
import { DaemonTask } from '../../tasks/daemon';
import { GenerateTask } from '../../tasks/generate/generate';
import { BootstrapTask } from '../../tasks/bootstrap';
import { nextOrDefault } from '../helpers';

const argsService: ArgsService = Container.get(ArgsService);

@Service()
export class RootService {
  private startTask: StartTask = Container.get(StartTask);
  private newTask: NewTask = Container.get(NewTask);
  private testTask: TestTask = Container.get(TestTask);
  private configService: ConfigService = Container.get(ConfigService);
  private schemaTask: SchemaTask = Container.get(SchemaTask);
  private deployTask: DeployTask = Container.get(DeployTask);
  private buildTask: BuildTask = Container.get(BuildTask);
  private generateTask: GenerateTask = Container.get(GenerateTask);
  private daemonTask: DaemonTask = Container.get(DaemonTask);
  private bootstrapTask: BootstrapTask = Container.get(BootstrapTask);

  checkForCustomTasks(): Promise<any> {
    return new Promise((resolve, reject) => {
      const commands = this.configService.config.commands;
      const filteredCommands = Object.keys(commands).filter(cmd => {
        if (cmd === argsService.args[2]) {
          if (commands[cmd][argsService.args[3]]) {
            if (commands[cmd][argsService.args[3]].constructor === Array) {
              let count = 0;
              const commandsArray = commands[cmd][argsService.args[3]];
              const commandsToExecute = commandsArray.map(res => {
                count++;
                let item;
                if (count === commandsArray.length) {
                  return (item = res);
                } else {
                  return res + ' && ';
                }
              });
              const finalCommand = commandsToExecute
                .toString()
                .replace(/[, ]+/g, ' ')
                .trim();
              resolve(exec(finalCommand));
            } else {
              resolve(exec(commands[cmd][argsService.args[3]]));
            }
            return true;
          } else {
            reject(`Missing custom command ${argsService.args[3]}`);
          }
        }
      });
      if (!filteredCommands.length) {
        reject('There are no tasks related with your command!');
      }
    });
  }

  async runTask() {
    if (argsService.args[2] === 'stop') {
      return await this.startTask.run({ state: false });
    }

    if (argsService.args[2] === 'start') {
      return await this.startTask.run({ state: true });
    }

    if (argsService.args[2] === 'build') {
      return await this.buildTask.run();
    }

    if (argsService.args[2] === 'new') {
      return await this.newTask.run();
    }

    if (argsService.args[2] === 'test') {
      return await this.testTask.run();
    }

    if (argsService.args[2] === 'schema') {
      const introspectionEndpoint = nextOrDefault('--url', '');
      const introspectionFolder = nextOrDefault('--folder', '');
      const pattern = nextOrDefault('--pattern', '');
      return await this.schemaTask.run(
        introspectionEndpoint,
        introspectionFolder,
        pattern
      );
    }

    if (argsService.args[2] === 'deploy') {
      return await this.deployTask.run();
    }

    if (argsService.args[2] === 'generate' || argsService.args[2] === 'g') {
      return await this.generateTask.run();
    }

    if (argsService.args[2] === 'daemon' || argsService.args[2] === 'd') {
      return await this.daemonTask.run();
    }

    if (argsService.args[2] === 'bootstrap' || argsService.args[2] === 'b') {
      return await this.bootstrapTask.run();
    }

    try {
      await this.checkForCustomTasks();
    } catch (e) {
      console.error(e);
    }
  }
}

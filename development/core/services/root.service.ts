import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { ArgsService } from '../services/args.service';
import { NewTask } from '../../tasks/new';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { TestTask } from '../../tasks/test';

const argsService: ArgsService = Container.get(ArgsService);

@Service()
export class RootService {

    private startTask: StartTask = Container.get(StartTask);
    private newTask: NewTask = Container.get(NewTask);
    private testTask: TestTask = Container.get(TestTask);
    private configService: ConfigService = Container.get(ConfigService);

    checkForCustomTasks(): Promise<any> {
        return new Promise((resolve, reject) => {
            const commands = this.configService.config.commands;
            const filteredCommands = Object.keys(commands)
                .filter(cmd => {
                    if (cmd === argsService.args[2]) {
                        if (commands[cmd][argsService.args[3]]) {
                            resolve(exec(commands[cmd][argsService.args[3]]));
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
            return await this.startTask.run();
        }

        if (argsService.args[2] === 'new') {
            return await this.newTask.run();
        }

        if (argsService.args[2] === 'test') {
            return await this.testTask.run();
        }

        try {
            await this.checkForCustomTasks();
        } catch (e) {
            console.error(e);
        }

    }

}
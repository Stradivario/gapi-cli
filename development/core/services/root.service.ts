import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { ArgsService } from '../services/args.service';
import { NewTask } from '../../tasks/new';
import { DockerTask } from '../../tasks/docker';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

const argsService: ArgsService = Container.get(ArgsService);

@Service()
export class RootService {

    private startTask: StartTask = Container.get(StartTask);
    private newTask: NewTask = Container.get(NewTask);
    private dockerTask: DockerTask = Container.get(DockerTask);
    private configService: ConfigService = Container.get(ConfigService);

    checkForCustomTasks(): Observable<any> {
        return Observable.create(observer => {
            const commands = this.configService.config.commands;
            const filteredCommands = Object.keys(commands)
                .filter(cmd => {
                    if (cmd === argsService.args[2]) {
                        if (commands[cmd][argsService.args[3]]) {
                            observer.next(exec(commands[cmd][argsService.args[3]]));
                            return true;
                        } else {
                            observer.error(`Missing custom command ${argsService.args[3]}`)
                        }
                    }
                });
            if (!filteredCommands.length) {
                observer.error('There are no tasks related with your command!')
            }
        })
    }

    runTask() {

        if (argsService.args[2] === 'stop') {
            return this.startTask.run({ state: false })
        }

        if (argsService.args[2] === 'start') {
            return this.startTask.run()
        }

        if (argsService.args[2] === 'new') {
            return this.newTask.run()
        }
        this.checkForCustomTasks()
            .subscribe(() => { }, (e) => {
                console.log(e)
            });

    }

}
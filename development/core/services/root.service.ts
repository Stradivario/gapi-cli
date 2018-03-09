import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { ArgsService } from '../services/args.service';
import { NewTask } from '../../tasks/new';
import { DockerTask } from '../../tasks/docker';
import { Observable } from 'rxjs';

const argsService: ArgsService = Container.get(ArgsService);

@Service()
export class RootService {

    private startTask: StartTask = Container.get(StartTask);
    private newTask: NewTask = Container.get(NewTask);
    private dockerTask: DockerTask = Container.get(DockerTask);


    runTask() {
 
        if (argsService.args[2] === 'start') {
            return this.startTask.run()
        }

        if (argsService.args[2] === 'new') {
            return this.newTask.run()
        }

        if (argsService.args[2] === 'docker') {
            return this.dockerTask.run()
        }

        console.log('There are no tasks related with your command!')
    }

}
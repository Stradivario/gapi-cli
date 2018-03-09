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
        this.start();
        this.newT();
        this.docker();
    }

    iterateOverTasks() {
        const descriptors = Object.getOwnPropertyDescriptors(this);
        Object.keys(descriptors).forEach(desc => {
            descriptors[desc]
        })
    }

    start() {
        argsService.findArgument('start').subscribe(() => this.startTask.run())
    }

    newT() {
        argsService.findArgument('new').subscribe(() => this.newTask.run())
    }

    docker() {
        argsService.findArgument('docker').subscribe(() => this.dockerTask.run())
    }

}
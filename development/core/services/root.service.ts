import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { ArgsService } from '../services/args.service';

@Service()
export class RootService {
    args: string[];
    private startTask: StartTask = Container.get(StartTask);
    private argsService: ArgsService = Container.get(ArgsService);

    runTask() {
        this.argsService.args
        .forEach((val, index) => {
            // console.log(`${index}: ${val}`);
            if(val.includes('start')) {
                this.startTask.run();
            }
        });
    }

}
import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';
import { Observable } from 'rxjs/Observable';
import { RootTypeTasks } from '../../core/types/root.type';

@Service()
export class ArgsService {
    args: string[];

    setArguments(args: string[]) {
        this.args = args;
    }

    findArgument(arg: RootTypeTasks): Observable<string> {
        return Observable.from(this.args).filter((val) => val === arg);
    }

}
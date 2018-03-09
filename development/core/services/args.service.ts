import { Container, Service } from 'typedi';
import { exec } from 'shelljs';
import { StartTask } from '../../tasks/start';

@Service()
export class ArgsService {
    args: string[];

    setArguments(args: string[]) {
        this.args = args;
    }

    findArgument(name) {
        return this.args.filter((arg) => arg === name)[0];
    }

}
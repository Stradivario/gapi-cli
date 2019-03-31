import { Service } from 'typedi';

@Service()
export class ArgsService {
    args: string[];

    setArguments(args: string[]) {
        this.args = args;
    }


}
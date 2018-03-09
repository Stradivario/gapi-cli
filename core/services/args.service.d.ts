import { Observable } from 'rxjs/Observable';
import { RootTypeTasks } from '../../core/types/root.type';
export declare class ArgsService {
    args: string[];
    setArguments(args: string[]): void;
    findArgument(arg: RootTypeTasks): Observable<string>;
}

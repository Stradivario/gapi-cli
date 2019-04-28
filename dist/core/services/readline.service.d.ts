/// <reference types="node" />
import { ReadLine } from 'readline';
export declare class ReadlineService {
    readline: ReadLine;
    private createReadlineInterface;
    clearScreenDown(): Promise<void>;
    createQuestion<T>(question: string, task: Function): Promise<{}>;
}

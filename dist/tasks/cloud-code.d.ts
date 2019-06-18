import { ExecService } from '../core/services/exec.service';
export declare class CloudCodeTask {
    execService: ExecService;
    run(): Promise<void>;
    exec(): Promise<void>;
}

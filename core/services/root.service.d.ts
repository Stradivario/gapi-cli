import { Observable } from 'rxjs';
export declare class RootService {
    private startTask;
    private newTask;
    private dockerTask;
    private configService;
    checkForCustomTasks(): Observable<any>;
    runTask(): void;
}

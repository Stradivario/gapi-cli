export declare class RootService {
    private startTask;
    private newTask;
    private testTask;
    private configService;
    private schemaTask;
    private deployTask;
    private buildTask;
    private generateTask;
    checkForCustomTasks(): Promise<any>;
    runTask(): Promise<void | {}>;
}

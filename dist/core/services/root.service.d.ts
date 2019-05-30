export declare class RootService {
    private startTask;
    private newTask;
    private testTask;
    private pluginTask;
    private configService;
    private schemaTask;
    private deployTask;
    private buildTask;
    private generateTask;
    private daemonTask;
    private bootstrapTask;
    checkForCustomTasks(): Promise<any>;
    runTask(): Promise<unknown>;
}

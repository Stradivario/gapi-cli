export declare class StartTask {
    private argsService;
    private configService;
    private environmentService;
    private execService;
    private config;
    run(stop?: {
        state?: boolean;
    }): Promise<void>;
}

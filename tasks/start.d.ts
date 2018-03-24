export declare class StartTask {
    private argsService;
    private configService;
    private environmentService;
    private execService;
    private config;
    private verbose;
    private quiet;
    run(stop?: {
        state?: boolean;
    }): Promise<void>;
    extendConfig(config: any): any;
}

export declare class StartTask {
    private argsService;
    private configService;
    private environmentService;
    private execService;
    private config;
    private configOriginal;
    private verbose;
    private quiet;
    run(stop?: {
        state?: boolean;
    }): Promise<{}>;
    prepareBundler(file: any, argv: any, start?: any): void;
    extendConfig(config: any): any;
}

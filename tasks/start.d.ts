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
    prepareBundler(file: any, argv: any, start?: boolean, buildOnly?: boolean, minify?: boolean): void;
    extendConfig(config: any): any;
}

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
    }): Promise<void | {}>;
    prepareBundler(file: any, argv: any, start?: boolean, buildOnly?: boolean, minify?: boolean, target?: 'browser' | 'node'): Promise<void>;
    extendConfig(config: any): any;
}

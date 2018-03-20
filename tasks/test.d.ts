export declare class TestTask {
    private execService;
    private argsService;
    private configService;
    private startTask;
    private environmentService;
    private args;
    private config;
    private verbose;
    run(): Promise<any>;
    setSleep(): void;
    setConfig(): void;
    extendConfig(config: any): any;
    validateConfig(key: string): void;
}

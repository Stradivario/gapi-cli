export declare class TestTask {
    private execService;
    private argsService;
    private configService;
    private startTask;
    private environmentService;
    private args;
    private config;
    private verbose;
    run(): Promise<never>;
    setSleep(): void;
    setConfig(): void;
    extendOrDefault(currentConfiguration: any): void;
    extendConfig(config: any): any;
    validateConfig(key: string): void;
}

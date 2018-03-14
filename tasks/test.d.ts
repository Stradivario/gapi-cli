export declare class TestTask {
    private execService;
    private argsService;
    private configService;
    private startTask;
    private environmentService;
    private args;
    private config;
    run(): Promise<never>;
    setSleep(): void;
    setConfig(): void;
    validateConfig(key: string): void;
}

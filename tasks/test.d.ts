export declare class ExecService {
    call(command: string, options?: any): Promise<{}>;
}
export declare class TestTask {
    private argsService;
    private configService;
    private startTask;
    args: string;
    config: string;
    run(): Promise<void>;
    setSleep(): void;
    setWorkerEnvironments(): void;
    setLocalEnvironments(): void;
    setConfig(): void;
    validateConfig(key: string): void;
}

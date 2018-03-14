export declare class StartTask {
    private argsService;
    private configService;
    args: string;
    config: string;
    run(stop?: {
        state?: boolean;
    }): void;
    setVariables(config: any): void;
}

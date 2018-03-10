export declare class NewTask {
    private argsService;
    args: string;
    repoLinks: {
        basic: string;
        advanced: string;
    };
    run(): void;
    exec(repoLink: string): void;
}

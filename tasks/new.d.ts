export declare class NewTask {
    private execService;
    private argsService;
    private repoLinks;
    run(): Promise<void>;
    exec(repoLink: string): Promise<void>;
}

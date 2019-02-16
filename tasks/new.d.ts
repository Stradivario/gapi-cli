#! /usr/bin/env node
export declare class NewTask {
    private execService;
    private argsService;
    private repoLinks;
    run(): Promise<void>;
    exec(repoLink: string, args?: string): Promise<void>;
}

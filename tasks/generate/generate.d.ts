#! /usr/bin/env node
export declare class GenerateTask {
    private execService;
    private argsService;
    run(): Promise<void>;
    exec(repoLink: string, args?: string): Promise<void>;
}

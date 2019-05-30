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
    }): Promise<unknown>;
    isDaemonRunning(): Promise<boolean>;
    private setFakeHapiServer;
    notifyDaemon(variables: {
        repoPath?: string;
    }): Promise<void>;
    prepareBundler(file: any, { original, schema }: {
        original: any;
        schema: any;
    }, start?: boolean, buildOnly?: boolean, minify?: boolean, target?: 'browser' | 'node', excludedFolders?: string[]): Promise<void>;
    extendConfig(config: any): any;
}

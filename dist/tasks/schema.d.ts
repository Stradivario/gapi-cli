export declare class SchemaTask {
    private folder;
    private endpoint;
    private node_modules;
    private bashFolder;
    private pattern;
    private execService;
    private argsService;
    private configService;
    private gapiFolder;
    private daemonFolder;
    private cacheFolder;
    run(introspectionEndpoint?: string, introspectionOutputFolder?: string, pattern?: string): Promise<void>;
    private createDir;
    collectQueries(): Promise<void>;
    private cacheSchemaIntegrity;
    private isSchemaCached;
    generateSchema(): Promise<boolean>;
    generateTypes(readDocumentsTemp: any): Promise<void>;
}

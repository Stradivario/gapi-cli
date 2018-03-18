export declare class SchemaTask {
    private folder;
    private endpoint;
    private node_modules;
    private bashFolder;
    private execService;
    private argsService;
    private configService;
    run(): Promise<void>;
    collectQueries(): Promise<void>;
    generateSchema(): Promise<void>;
}

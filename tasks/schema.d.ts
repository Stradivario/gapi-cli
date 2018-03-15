export declare class SchemaTask {
    private folder;
    private endpoint;
    private node_modules;
    private execService;
    private argsService;
    private configService;
    run(): Promise<void>;
    generateSchema(): Promise<void>;
}

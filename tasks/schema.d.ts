export declare class SchemaTask {
    private folder;
    private endpoint;
    private node_modules;
    private bashFolder;
    private pattern;
    private execService;
    private argsService;
    private configService;
    run(): Promise<void>;
    private createDir();
    collectQueries(): Promise<void>;
    generateSchema(): Promise<void>;
    generateTypes(readDocumentsTemp: any): Promise<void>;
}

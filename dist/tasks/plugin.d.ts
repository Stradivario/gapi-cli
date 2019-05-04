export declare class PluginTask {
    run(): Promise<void>;
    add(hash: string): Promise<void>;
    private validateHash;
    remove(hash: string): Promise<void>;
    private readFile;
    private writeHashesToFile;
}

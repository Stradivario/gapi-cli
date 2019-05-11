import { ExternalImporter, FileService, Metadata } from "@rxdi/core";
import { PluginWatcherService } from "./plugin-watcher.service";
interface CustomMetadata extends Function {
    metadata: Metadata;
}
export declare class PluginLoader {
    private externalImporterService;
    private fileService;
    private pluginWatcherService;
    private defaultIpfsProvider;
    private defaultDownloadFilename;
    cache: {
        [key: string]: CustomMetadata;
    };
    constructor(externalImporterService: ExternalImporter, fileService: FileService, pluginWatcherService: PluginWatcherService);
    loadPlugins(): import("rxjs").Observable<CustomMetadata[]>;
    private loadIpfsHashes;
    private getModule;
    private cacheModule;
    private loadModule;
    private makeIpfsHashFile;
    private makePluginsDirectories;
    private filterDups;
}
export {};

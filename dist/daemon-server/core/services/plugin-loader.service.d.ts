import { ExternalImporter, FileService, Metadata } from "@rxdi/core";
import { Subject } from "rxjs";
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
    fileWatcher: Subject<string[]>;
    cache: {
        [key: string]: CustomMetadata;
    };
    constructor(externalImporterService: ExternalImporter, fileService: FileService, pluginWatcherService: PluginWatcherService);
    getModule(hash: string, provider?: string): CustomMetadata | import("rxjs").Observable<CustomMetadata>;
    private isModuleHashed;
    private cacheModule;
    private loadModule;
    private makePluginsDirectories;
    loadPlugins(ipfsHashes?: string[]): import("rxjs").Observable<CustomMetadata[]>;
    private filterDups;
}
export {};

import { ExternalImporter, FileService, Metadata } from '@rxdi/core';
import { PluginWatcherService } from './plugin-watcher.service';
import { IpfsHashMapService } from './ipfs-hash-map.service';
interface CustomMetadata extends Function {
    metadata: Metadata;
}
export declare class PluginLoader {
    private externalImporterService;
    private fileService;
    private pluginWatcherService;
    private ipfsHashMapService;
    private defaultIpfsProvider;
    private defaultDownloadFilename;
    private filterDups;
    cache: {
        [key: string]: CustomMetadata;
    };
    constructor(externalImporterService: ExternalImporter, fileService: FileService, pluginWatcherService: PluginWatcherService, ipfsHashMapService: IpfsHashMapService);
    loadPlugins(): import("rxjs").Observable<CustomMetadata[]>;
    private loadIpfsHashes;
    private getModule;
    private cacheModule;
    private loadModule;
    private makeIpfsHashFile;
    private makePluginsDirectories;
}
export {};

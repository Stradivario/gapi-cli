import { ExternalImporter, FileService, Metadata } from "@rxdi/core";
export declare class PluginLoader {
    private externalImporterService;
    private fileService;
    private hashCache;
    private defaultIpfsProvider;
    private defaultDownloadFilename;
    constructor(externalImporterService: ExternalImporter, fileService: FileService);
    getModule(hash: string, provider?: string): {
        metadata: Metadata;
    } | import("rxjs").Observable<{
        metadata: Metadata;
    }>;
    private loadModule;
    loadPlugins(ipfsHashes?: string[], pluginsFolder?: string): import("rxjs").Observable<any[]>;
}

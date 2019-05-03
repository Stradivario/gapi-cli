import { ExternalImporter, FileService, Metadata } from '@rxdi/core';
import { Observable } from 'rxjs';
export declare class PluginLoader {
    private externalImporterService;
    private fileService;
    hashCache: {
        [key: string]: {
            metadata: Metadata;
        };
    };
    defaultPluginsFolder: string;
    defaultExternalPluginsFolder: string;
    defaultIpfsProvider: string;
    defaultDownloadFilename: string;
    constructor(externalImporterService: ExternalImporter, fileService: FileService);
    getModule: (hash: string, provider?: string) => {
        metadata: Metadata;
    } | Observable<{}>;
    private loadModule;
    loadPlugins(modules?: string[], pluginsFolder?: string): Observable<any[]>;
}

import { FileService } from '@rxdi/core';
import { ChildService } from './child.service';
import { Observable } from 'rxjs';
export declare class PluginWatcherService {
    private childService;
    private fileService;
    constructor(childService: ChildService, fileService: FileService);
    private isNotFromExternalPlugins;
    watch(): Observable<string[]>;
    private restartDaemon;
}

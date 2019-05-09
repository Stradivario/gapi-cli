import { ChildService } from './child.service';
import { Observable } from 'rxjs';
export declare class PluginWatcherService {
    private childService;
    constructor(childService: ChildService);
    private isNotFromExternalPlugins;
    watch(): Observable<string[]>;
    private restartDaemon;
}

import { ILinkListType } from '../../api-introspection';
import { ListService } from './list.service';
import { ChildService } from './child.service';
export declare class DaemonService {
    private listService;
    private childService;
    private noop;
    private gapiFolder;
    private daemonFolder;
    private processListFile;
    constructor(listService: ListService, childService: ChildService);
    notifyDaemon(payload: ILinkListType): import("rxjs").Observable<ILinkListType>;
    private trigger;
    private saveMainNode;
    private writeGapiCliConfig;
    private findByRepoPath;
    private findLinkedRepos;
}

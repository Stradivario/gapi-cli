import { PubSubService } from '@gapi/core';
import { ListService } from './core/services/list.service';
import { ILinkListType } from './api-introspection';
import { DaemonService } from './core/services/daemon.service';
import { Observable } from 'rxjs';
export declare class ServerController {
    private listService;
    private daemonService;
    private pubsub;
    constructor(listService: ListService, daemonService: DaemonService, pubsub: PubSubService);
    statusSubscription(message: any): {
        repoPath: any;
    };
    getLinkList(): Promise<ILinkListType[]>;
    notifyDaemon(root: any, payload: ILinkListType): Observable<ILinkListType>;
}

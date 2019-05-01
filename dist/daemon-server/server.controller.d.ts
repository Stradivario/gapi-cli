import { ListService } from './core/services/list.service';
import { ILinkListType } from './api-introspection';
import { DaemonService } from './core/services/daemon.service';
export declare class ServerController {
    private listService;
    private daemonService;
    constructor(listService: ListService, daemonService: DaemonService);
    getLinkList(): Promise<ILinkListType[]>;
    notifyDaemon(root: any, payload: ILinkListType): Promise<ILinkListType>;
}

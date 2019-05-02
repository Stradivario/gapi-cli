import { ILinkListType } from '../../api-introspection';
import { ListService } from './list.service';
import { ChildService } from './child.service';
export declare class DaemonService {
    private listService;
    private childService;
    constructor(listService: ListService, childService: ChildService);
    private trigger;
    private writeGapiCliConfig;
    notifyDaemon(payload: ILinkListType): import("rxjs").Observable<ILinkListType>;
}

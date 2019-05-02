import { ILinkListType } from '../../api-introspection';
import { Observable } from 'rxjs';
import { ListService } from './list.service';
export declare class DaemonService {
    private listService;
    constructor(listService: ListService);
    private trigger;
    writeGapiCliConfig(gapiLocalConfig: string): Promise<void>;
    notifyDaemon(payload: ILinkListType): Observable<ILinkListType>;
}

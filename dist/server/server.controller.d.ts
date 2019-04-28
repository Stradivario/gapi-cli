import { PubSubService } from '@gapi/core';
import { ListService } from './core/services/list.service';
export declare class ServerController {
    private pubsub;
    private listService;
    constructor(pubsub: PubSubService, listService: ListService);
    statusSubscription(message: any): {
        status: any;
    };
    serverRestarted(message: any): {
        status: any;
    };
    getLinkList(): Promise<import("./api-introspection").ILinkListType[]>;
    notifyDaemon(root: any, payload: any): Promise<{}>;
}

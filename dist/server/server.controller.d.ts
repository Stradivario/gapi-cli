import { PubSubService } from '@gapi/core';
export declare class ServerController {
    private pubsub;
    constructor(pubsub: PubSubService);
    statusSubscription(message: any): {
        status: any;
    };
}

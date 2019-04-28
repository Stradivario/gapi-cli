import { Controller, PubSubService, Subscribe, Subscription, Type } from '@gapi/core';
import { SubscriptionStatusType } from './server.type';

@Controller()
export class ServerController {

    constructor(
        private pubsub: PubSubService
    ) {
        let count = 0;
        setInterval(() => {
            count++;
            pubsub.publish('CREATE_SIGNAL_BASIC', `AZ${count}`);
        }, 2000)
    }

    @Type(SubscriptionStatusType)
    @Subscribe((self: ServerController) => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC'))
    @Subscription()
    statusSubscription(message) {
        return {
            status: message
        }
    }

}
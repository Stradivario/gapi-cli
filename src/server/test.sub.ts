import { gql } from 'apollo-server-core';
import { subscribeToTopic, createWebsocketLink } from '@gapi/core';
import { ISubscription } from './api-introspection';

const subscription = subscribeToTopic<{data: ISubscription}>(gql`
  subscription {
    statusSubscription {
      status
    }
  }
`).subscribe(stream => {
  console.log(stream.data.statusSubscription.status);
});
setTimeout(() => {
  subscription.unsubscribe();
}, 5000);

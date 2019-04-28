import { gql } from 'apollo-server-core';
import { subscribeToTopic, createWebsocketLink, sendRequest } from '@gapi/core';
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

sendRequest({
    query: `
        query {
            status {
                status
            }
        }
    `
}).then((stat) => console.log(stat))
// setTimeout(() => {
//   subscription.unsubscribe();
// }, 5000);

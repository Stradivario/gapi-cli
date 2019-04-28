import { gql } from 'apollo-server-core';
import { subscribeToTopic, createWebsocketLink, sendRequest, Container, HAPI_SERVER } from '@gapi/core';
import { ISubscription } from './api-introspection';

Container.set(HAPI_SERVER, { info: { port: '42000' } });

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

import { BootstrapFramework } from '@rxdi/core';
import { ServerModule } from './server.module';
import { CoreModule } from '@gapi/core';
BootstrapFramework(ServerModule, [
  CoreModule.forRoot({
    server: {
      hapi: {
        port: 42001
      }
    },
    graphql: {
      graphiql: true,
      openBrowser: true,
      graphiQlPlayground: false
    },
    // pubsub: {
    //   host: 'localhost',
    //   port: 5672,
    //   log: true,
    //   activateRabbitMQ: true
    // },
    daemon: {
      activated: true,
      link: 'http://localhost:42001/graphql'
    }
  })
]).subscribe(() => console.log('Server started'), console.error.bind(console));

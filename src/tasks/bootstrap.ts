import { Service } from 'typedi';
import { BootstrapFramework } from '@rxdi/core';
import { ServerModule } from '../server/server.module';
import { CoreModule, CoreModuleConfig } from '@gapi/core';

@Service()
export class BootstrapTask {
  async run(options?: CoreModuleConfig) {
    BootstrapFramework(ServerModule, [
      CoreModule.forRoot(options || {
        graphql: {
          graphiql: true,
          graphiQlPlayground: false
        }
      })
    ]).subscribe(() => console.log('Server started'), console.error.bind(console));
  }
}
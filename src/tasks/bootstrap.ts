import { Service } from '@rxdi/core';
import { BootstrapFramework } from '@rxdi/core';
import { ServerModule } from '../daemon-server/server.module';
import { CoreModule, CoreModuleConfig } from '@gapi/core';

@Service()
export class BootstrapTask {
  async run(options?: CoreModuleConfig) {
    BootstrapFramework(ServerModule, [
      CoreModule.forRoot(
        options || {
          graphql: {
            graphiql: true,
            graphiQlPlayground: false
          }
        }
      )
    ]).subscribe(
      () => console.log('Daemon started'),
      console.error.bind(console)
    );
  }
}

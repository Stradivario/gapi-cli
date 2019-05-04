import { Service, setup } from '@rxdi/core';
import { ServerModule } from '../daemon-server/server.module';
import { CoreModule, CoreModuleConfig } from '@gapi/core';
import { switchMap } from 'rxjs/operators';
import { PluginLoader } from '../daemon-server/core/services/plugin-loader.service';
import { PluginWatcherService } from '../daemon-server/core/services/plugin-watcher.service';

@Service()
export class BootstrapTask {
  constructor(private pluginLoader: PluginLoader) {}
  async run(options?: CoreModuleConfig) {
    this.pluginLoader
      .loadPlugins([])
      .pipe(
        switchMap(pluginModules =>
          setup({
            imports: [
              ...pluginModules,
              CoreModule.forRoot(
                options || {
                  server: {
                    hapi: {
                      port: 42000
                    }
                  },
                  graphql: {
                    openBrowser: false,
                    graphiql: false,
                    graphiQlPlayground: false
                  }
                  // pubsub: {
                  //   host: 'localhost',
                  //   port: 5672,
                  //   log: true,
                  //   activateRabbitMQ: true
                  // },
                  // daemon: {
                  //   activated: true,
                  //   link: 'http://localhost:42001/graphql'
                  // }
                }
              ),
              ServerModule
            ],
            providers: [
              PluginWatcherService
            ]
          })
        )
      )
      .subscribe(
        () => console.log('Daemon started'),
        console.error.bind(console)
      );
  }
}

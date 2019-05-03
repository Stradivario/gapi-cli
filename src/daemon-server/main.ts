import { setup } from '@rxdi/core';
import { ServerModule } from './server.module';
import { CoreModule } from '@gapi/core';
import { FileService, Container } from '@gapi/core'; 
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { homedir } from 'os';

const fileService = Container.get(FileService);
let plugins = of([]);
const pluginsFolder = `${homedir()}/.gapi/daemon/plugins`;
if (fileService.isPresent(pluginsFolder)) {
  plugins = fileService.fileWalker(pluginsFolder);   
}
plugins.pipe(
  switchMap((paths) => of(paths.map((path) => {
    if (path.includes('.js')) {
        const { MainModule } = require(path);
        return MainModule;
    }
  }).filter(p => !!p))),
  switchMap((pluginModules) => setup({
    imports: [
      ...pluginModules,
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
      }),
      ServerModule
    ]
  }))
)
.subscribe(() => console.log('Server started'), console.error.bind(console));

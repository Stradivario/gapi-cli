import { BootstrapFramework } from "@rxdi/core";
import { ServerModule } from "./server.module";
import { CoreModule } from "@gapi/core";

BootstrapFramework(ServerModule, [CoreModule.forRoot({
    server: {
        hapi: {
            port: 42001
        }
    },
    graphql: {
        graphiql: true,
        openBrowser: false,
        graphiQlPlayground: false
    },
    daemon: {
        activated: true
    }
})]).subscribe(
    () => console.log('Server started'),
    console.error.bind(console)
);

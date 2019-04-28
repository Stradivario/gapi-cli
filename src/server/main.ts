import { BootstrapFramework } from "@rxdi/core";
import { ServerModule } from "./server.module";
import { CoreModule } from "@gapi/core";

BootstrapFramework(ServerModule, [CoreModule.forRoot({
    graphql: {
        graphiql: true,
        graphiQlPlayground: false
    }
})]).subscribe(
    () => console.log('Server started'),
    console.error.bind(console)
);
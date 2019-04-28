import { Container } from "typedi";
import { BootstrapTask } from "../../tasks/bootstrap";

Container.get(BootstrapTask).run({
    graphql: {
      openBrowser: false,
      graphiql: false,
      graphiQlPlayground: false
    }
});
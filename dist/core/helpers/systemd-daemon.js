"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const bootstrap_1 = require("../../tasks/bootstrap");
core_1.Container.get(bootstrap_1.BootstrapTask).run({
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
});

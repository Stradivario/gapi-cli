"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const bootstrap_1 = require("../../tasks/bootstrap");
typedi_1.Container.get(bootstrap_1.BootstrapTask).run({
    graphql: {
        openBrowser: false,
        graphiql: false,
        graphiQlPlayground: false
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAPI_CLI_CONFIG_TEMPLATE = (port) => `
config:
  schema:
    introspectionEndpoint: http://localhost:${port}/graphql
    introspectionOutputFolder: ./api-introspection
`;

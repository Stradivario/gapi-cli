"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.ServerMetadataType = new graphql_1.GraphQLObjectType({
    name: 'ServerMetadataType',
    fields: () => ({
        port: {
            type: graphql_1.GraphQLInt
        }
    })
});
exports.ServerMetadataInputType = new graphql_1.GraphQLInputObjectType({
    name: 'ServerMetadataInputType',
    fields: () => ({
        port: {
            type: graphql_1.GraphQLInt
        }
    })
});

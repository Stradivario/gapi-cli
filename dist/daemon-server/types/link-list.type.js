"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const server_metadata_type_1 = require("./server-metadata.type");
exports.LinkListType = new graphql_1.GraphQLObjectType({
    name: 'LinkListType',
    fields: () => ({
        repoPath: {
            type: graphql_1.GraphQLString
        },
        introspectionPath: {
            type: graphql_1.GraphQLString
        },
        linkName: {
            type: graphql_1.GraphQLString
        },
        serverMetadata: {
            type: server_metadata_type_1.ServerMetadataType
        }
    })
});

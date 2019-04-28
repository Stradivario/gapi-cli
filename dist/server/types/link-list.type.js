"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
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
    })
});

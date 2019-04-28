"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.SubscriptionStatusType = new graphql_1.GraphQLObjectType({
    name: 'SubscriptionStatusType',
    fields: () => ({
        status: {
            type: graphql_1.GraphQLString
        }
    })
});

import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInt } from "graphql";

export const ServerMetadataType = new GraphQLObjectType({
    name: 'ServerMetadataType',
    fields: () => ({
        port: {
            type: GraphQLInt
        }
    })
});

export const ServerMetadataInputType = new GraphQLInputObjectType({
    name: 'ServerMetadataInputType',
    fields: () => ({
        port: {
            type: GraphQLInt
        }
    })
});
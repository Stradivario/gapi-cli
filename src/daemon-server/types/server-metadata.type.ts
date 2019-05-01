import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType } from "graphql";

export const ServerMetadataType = new GraphQLObjectType({
    name: 'ServerMetadataType',
    fields: () => ({
        port: {
            type: GraphQLString
        }
    })
});

export const ServerMetadataInputType = new GraphQLInputObjectType({
    name: 'ServerMetadataInputType',
    fields: () => ({
        port: {
            type: GraphQLString
        }
    })
});
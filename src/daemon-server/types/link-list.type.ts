import { GraphQLObjectType, GraphQLString } from 'graphql';

export const LinkListType = new GraphQLObjectType({
    name: 'LinkListType',
    fields: () => ({
        repoPath: {
            type: GraphQLString
        },
        introspectionPath: {
            type: GraphQLString
        },
        linkName: {
            type: GraphQLString
        },
    })
});
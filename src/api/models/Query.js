import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
} from 'graphql';

import ListType from './List.js';
import { lists } from '../resolvers/query.js'

const PaginateInfoInputType = new GraphQLInputObjectType({
    name: 'PaginateInfo',
    fields: {
        skip: { type: GraphQLInt },
        take: { type: GraphQLInt },
    },
});

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        lists: {
            type: new GraphQLList(new GraphQLNonNull(ListType)),
            args: {
                input: { type: PaginateInfoInputType }
            },
            resolve: lists
        }
    },
})

export {
    query,
    PaginateInfoInputType
}
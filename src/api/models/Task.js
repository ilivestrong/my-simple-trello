import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
} from 'graphql';

import ListType from './List.js';
import { list } from "../resolvers/list.js"

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        completed: {
            type: GraphQLBoolean
        },
        position: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        list: {
            type: ListType,
            resolve: list
        }
    })
})


export default TaskType
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLID
} from 'graphql';

import TaskType from './Task.js';
import { tasks } from "../resolvers/task.js"

const ListType = new GraphQLObjectType({
    name: 'List',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        tasks: {
            type: new GraphQLList(new GraphQLNonNull(TaskType)),
            resolve: tasks
        }
    }),
})

export default ListType
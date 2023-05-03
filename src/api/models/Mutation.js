import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean
} from 'graphql';

import ListType from './List.js';
import TaskType from './Task.js';
import {
    createList,
    createTask,
    updateTask,
    moveTask
} from '../resolvers/mutation.js'


const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createList: {
            type: ListType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: createList
        },
        createTask: {
            type: TaskType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                listID: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: createTask
        },
        updateTask: {
            type: TaskType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                completed: {
                    type: new GraphQLNonNull(GraphQLBoolean)
                },
                taskID: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve: updateTask
        },
        moveTask: {
            type: new GraphQLList(new GraphQLNonNull(TaskType)),
            args: {
                taskID: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                listID: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                newPosition: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve: moveTask
        }
    },
})

export default mutation;
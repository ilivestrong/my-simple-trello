import {
    GraphQLSchema
} from 'graphql';

import { query } from "./Query.js";
import mutation from "./Mutation.js";

const schema = new GraphQLSchema({
    query,
    mutation,
})

export default schema
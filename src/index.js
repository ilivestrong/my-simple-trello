import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from 'url';
import { ApolloServer } from "apollo-server"
import { PrismaClient } from "@prisma/client"
import { Mutation, Query, List, Task } from "./api/resolvers/index.js"
import schema from './api/models/Schema.js'

const resolvers = { Mutation, Query, List, Task }
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient()

const typeDefs = `
      type Query {
        lists(input: PaginateInfo): [List!]
      }
      
      type Mutation {
        createList(title: String!): List
        createTask(title: String!, listID: Int!): Task
        updateTask(title: String!, completed: Boolean!, taskID: Int!): Task
        moveTask(taskID: Int!, listID: Int!, newPosition: Int!): [Task!]
      }
      
      type List {
        id: ID!
        title: String!
        tasks: [Task!]
      }
      
      type Task {
            id: ID!
            title: String!
            completed: Boolean
            position: Int!
            list: List
      }
      
      input PaginateInfo {
        skip: Int
        take: Int
      }
`

const server = new ApolloServer({
  typeDefs,
  schema,
  context: {
    prisma,
  },
})

server
  .listen()
  .then(({ url }) => console.log(`trello server running at: ${url}`))
  .catch(async (err) => {
    console.log(`shutting down server, reason: ${err}`)
    await prisma.$disconnect();
  })
import * as fs from "fs"
import * as path from "path"
import {fileURLToPath} from 'url';
import {ApolloServer} from "apollo-server"
import {PrismaClient} from "@prisma/client"
import {Mutation,Query} from "./api/resolvers/index.js"


const resolvers = { Mutation,Query }
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'api', 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})


server
  .listen()
  .then(({ url}) => console.log(`trello server running at: ${url}`))
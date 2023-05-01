const fs = require("fs")
const path = require("path")
const {
  ApolloServer
} = require("apollo-server")
const {
  Mutation,
  Query
} = require("./api/resolvers")
const resolvers = {
  Mutation,
  Query,
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'api', 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server.listen()
  .then(({
    url
  }) => console.log(`trello server running at: ${url}`))
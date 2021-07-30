import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    users: [User!]!
  }
  type User {
    name: String
  }
`

const resolvers = {
  Query: {
    users(parent, args, context) {
      return [
        { name: 'Telma Guimarães Manso' },
        { name: 'Leonardo Quental Castilho' },
        { name: 'Cármen Vasques Fernandes' },
        { name: 'Natanael Camilo Frois' },
        { name: 'Celina Alcântara Freire' },
      ]
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

const startServer = apolloServer.start()

export default async function handler(req, res) {
  console.log("handler")
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
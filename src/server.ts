import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

export async function startServer () {
  const connection = await createConnection()
  const schema = await buildSchema()
  const server = new ApolloServer({ schema })
  await server.listen(4000)
  console.log('Server has started!')
}

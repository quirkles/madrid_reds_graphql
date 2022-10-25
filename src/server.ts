import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import { AppDataSource } from './datasource'
import { UserResolver } from './resolvers/userResolver'
import { appConfig } from './config'
import { logger } from './logger'

export async function startServer () {
  try {
    await AppDataSource.initialize()
    logger.info('Connected to database')
  } catch (e) {
    throw new Error(`Failed to connect to data source: ${(e as Error).message}`)
  }

  const schema = await buildSchema({
    resolvers: [UserResolver] // add this
  })

  const server = new ApolloServer({ schema })
  await server.listen(appConfig.PORT)

  logger.info(`Server listening on port: ${appConfig.PORT}`) //eslint-disable-line
}

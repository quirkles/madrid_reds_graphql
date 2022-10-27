import { ApolloServer } from 'apollo-server'
import { Container } from 'typedi'
import { buildSchema } from 'type-graphql'
import { v4 } from 'uuid'

import { AppDataSource } from './datasource'
import { UserResolver } from './resolvers'
import { createContext } from './context'
import { createLogger } from './logger'
import { appConfig } from './config'

export async function startServer () {
  const logger = createLogger({
    executionId: v4()
  })
  Container.set('Logger', logger)
  try {
    await AppDataSource.initialize()
    logger.info('Connected to database')
  } catch (e) {
    throw new Error(`Failed to connect to data source: ${(e as Error).message}`)
  }

  const schema = await buildSchema({
    container: Container,
    resolvers: [UserResolver] // add this
  })

  const server = new ApolloServer({
    schema,
    context: createContext
  })

  const { url } = await server.listen(appConfig.PORT)

  logger.info(`Server listening at: ${url}`) //eslint-disable-line
}

import 'reflect-metadata'

import { v4 } from 'uuid'
import { ApolloServer } from 'apollo-server'
import { buildSchema, ResolverData } from 'type-graphql'

import { container } from './container'
import { appConfig } from './config'
import { AppDataSource } from './datasource'
import { UserResolver } from './resolvers'
import { AppContext, createContextFunction } from './context'
import { createLogger } from './logger'

export async function startServer () {
  const logger = createLogger({ executionId: v4() })
  try {
    await AppDataSource.initialize()
  } catch (e) {
    throw new Error(`Failed to connect to data source: ${(e as Error).message}`)
  }

  const schema = await buildSchema({
    // container,
    container: ({ context }: ResolverData<AppContext>) => context.container,
    resolvers: [UserResolver]
  })

  const server = new ApolloServer({
    schema,
    context: createContextFunction(logger),
    plugins: [
      {
        async requestDidStart () {
          return {
            async willSendResponse (requestContext) {
              // remember to dispose the scoped container to prevent memory leaks
              requestContext.context.container.unbindAll()
            }
          }
        }
      }
    ]
  })

  const { url } = await server.listen(appConfig.PORT)
  logger.info(`Server listening at: ${url}`)
}

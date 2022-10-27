import { type IncomingMessage, ServerResponse } from 'http'
import { Container } from 'typedi'
import { Logger } from 'winston'
import { v4 } from 'uuid'

export interface ApolloContext {
  sessionUser?: {
        jwt: string
    }
}

export async function createContext (contextArg: {req: IncomingMessage; res: ServerResponse}): Promise<ApolloContext> {
  const logger: Logger = Container.get('Logger')

  if (logger) {
    const childLogger = logger.child({
      requestId: v4()
    })
    childLogger.info('Incoming request', {
      url: contextArg.req.url,
      method: contextArg.req.method
    })
    Container.set('Logger', childLogger)
  }

  const context: ApolloContext = {}

  // Try to grab the jwt from the auth header
  const authHeader = contextArg.req.headers.Authorization
  if (authHeader && typeof authHeader === 'string') {
    const regexResult = /Bearer: (?<jwt>[a-zA-Z0-9]+)/.exec(authHeader)
    const jwt = regexResult?.groups?.jwt
    if (jwt) {
      context.sessionUser = { jwt }
    }
  }

  return context
}

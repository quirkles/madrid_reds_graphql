import { Container } from "inversify";
import { type IncomingMessage, ServerResponse } from "http";
import { Logger } from "winston";
import { v4 } from "uuid";
import { container, TYPES } from "../container";

export interface AppContext {
  sessionUser?: {
    jwt: string;
  };
  container: Container;
  logger: Logger;
}

export function createContextFunction(logger: Logger) {
  return async function (contextArg: {
    req: IncomingMessage;
    res: ServerResponse;
  }): Promise<AppContext> {
    const childLogger: Logger = logger.child({
      requestId: v4(),
      url: contextArg.req.url || "unknown",
      method: contextArg.req.method || "unknown",
    });

    childLogger.info("Incoming request", {});

    const childContainer = container.createChild();

    childContainer.bind<Logger>(TYPES.logger).toConstantValue(childLogger);

    const context: AppContext = {
      logger: childLogger,
      container: childContainer,
    };

    // Try to grab the jwt from the auth header
    const authHeader = contextArg.req.headers.Authorization;
    if (authHeader && typeof authHeader === "string") {
      const regexResult = /Bearer: (?<jwt>[a-zA-Z0-9]+)/.exec(authHeader);
      const jwt = regexResult?.groups?.jwt;
      if (jwt) {
        context.sessionUser = { jwt };
      }
    }

    return context;
  };
}

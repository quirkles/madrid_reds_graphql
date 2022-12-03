import { Container } from "inversify";
import { type IncomingMessage, ServerResponse } from "http";
import { Logger } from "winston";
import { v4 } from "uuid";
import { container, TYPES } from "../container";
import { TRoleName } from "../datalayer";

export interface AppContextSessionUserObject {
  jwt: string;
  roles?: TRoleName[];
}

export interface AppContext {
  sessionUser: AppContextSessionUserObject | null;
  container: Container;
  logger: Logger;
}

export function createContextFunction(logger: Logger) {
  return async function (contextArg: {
    req: IncomingMessage;
    res: ServerResponse & { req: { body: string } };
  }): Promise<AppContext> {
    const childLogger: Logger = logger.child({
      requestId: v4(),
    });
    childLogger.info("Incoming request body", {
      body: contextArg.res.req.body,
    });

    const childContainer = container.createChild();

    childContainer.bind<Logger>(TYPES.logger).toConstantValue(childLogger);

    const context: AppContext = {
      logger: childLogger,
      container: childContainer,
      sessionUser: null,
    };

    // Try to grab the jwt from the auth header
    const authHeader = contextArg.req.headers.authorization;
    childLogger.info({ authHeader: authHeader || "No auth headers" });
    if (authHeader) {
      const regexResult = /Bearer: (?<jwt>[a-zA-Z0-9.\-_]+)/.exec(authHeader);
      const jwt = regexResult?.groups?.jwt;
      if (jwt) {
        childLogger.info("setting JWT", { jwt: jwt || "none" });
        context.sessionUser = { jwt };
      }
    }

    return context;
  };
}

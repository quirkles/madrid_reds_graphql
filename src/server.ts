import "reflect-metadata";

import { v4 } from "uuid";
import { ApolloServer } from "apollo-server";
import { buildSchema, ResolverData } from "type-graphql";

// We need to import the container here because ot needs to be the first thing that happens, even though we dont actually need the container here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { container } from "./container";

import { appConfig } from "./config";
import { AppDataSource } from "./datalayer";
import { TeamResolver, UserResolver } from "./resolvers";
import { AppContext, createContextFunction } from "./context";
import { CustomAuthChecker, createLogger } from "./services";

export async function startServer() {
  try {
    await AppDataSource.initialize();
  } catch (e) {
    throw new Error(
      `Failed to connect to data source: ${(e as Error).message}`
    );
  }

  const logger = createLogger(appConfig.env !== "local", { executionId: v4() });

  const customAuthChecker = new CustomAuthChecker();

  const schema = await buildSchema({
    container: ({ context }: ResolverData<AppContext>) => context.container,
    resolvers: [UserResolver, TeamResolver],
    authChecker: customAuthChecker.check.bind(customAuthChecker),
  });

  const server = new ApolloServer({
    schema,
    context: createContextFunction(logger),
    plugins: [
      {
        async requestDidStart() {
          return {
            async willSendResponse(requestContext) {
              // remember to dispose the scoped container to prevent memory leaks
              requestContext.context.container.unbindAll();
            },
          };
        },
      },
    ],
  });

  const { url } = await server.listen(appConfig.PORT);
  logger.info(`Server listening at: ${url}`);
}

import "reflect-metadata";

import { v4 } from "uuid";
import { ApolloServer } from "apollo-server";
import { buildSchema, ResolverData } from "type-graphql";

import { container } from "./container";

import { appConfig } from "./config";
import { AppDataSource } from "./datalayer/datasource";
import { TeamResolver, UserResolver } from "./resolvers";
import { AppContext, createContextFunction } from "./context";
import { createLogger } from "./logger";
import { UserToTeamModel } from "./datalayer";

export async function startServer() {
  try {
    await AppDataSource.initialize();
  } catch (e) {
    throw new Error(
      `Failed to connect to data source: ${(e as Error).message}`
    );
  }

  const logger = createLogger({ executionId: v4() });

  const schema = await buildSchema({
    container: ({ context }: ResolverData<AppContext>) => context.container,
    resolvers: [UserResolver, TeamResolver, UserToTeamModel],
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

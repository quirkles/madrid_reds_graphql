import { Container, interfaces } from "inversify";
import { DataSource } from "typeorm";

import {
  ICryptoService,
  CryptoService,
  IMailerService,
  MailerService,
} from "../services";
import { UserResolver, TeamResolver } from "../resolvers";
import { appConfig, IAppConfig } from "../config";
import { TYPES } from "./types";
import { AppDataSource } from "../datalayer/datasource";
import Factory = interfaces.Factory;
import {
  authenticationTokenRepositoryFactory,
  IAuthenticationTokenRepository,
  ITeamRepository,
  IUserRepository,
  IVerificationTokenRepository,
  teamRepositoryFactory,
  userRepositoryFactory,
  verificationTokenRepositoryFactory,
} from "../datalayer";
import { TeamPlayerResolver } from "../resolvers/teamPlayerResolver/resolver";

const container = new Container({ skipBaseClassChecks: true });
// Resolvers
container.bind<UserResolver>(UserResolver).to(UserResolver).inSingletonScope();
container.bind<TeamResolver>(TeamResolver).to(TeamResolver).inSingletonScope();
container
  .bind<TeamPlayerResolver>(TeamPlayerResolver)
  .to(TeamPlayerResolver)
  .inSingletonScope();

// Services
container.bind<IMailerService>(TYPES.MailerService).to(MailerService);

// Constants
container.bind<IAppConfig>(TYPES.appConfig).toConstantValue(appConfig);

const sharedCryptoService = new CryptoService(appConfig); // we use a shared instance so we can generate an iv each time
container
  .bind<ICryptoService>(TYPES.cryptoService)
  .toConstantValue(sharedCryptoService);

container.bind<DataSource>(TYPES.dataSource).toConstantValue(AppDataSource);

// Factories

// These repositories are bound as factories because they require the data source to have been initialized, the factories return singleton instances
container
  .bind<Factory<ITeamRepository>>(TYPES.TeamRepositoryFactory)
  .toFactory<ITeamRepository>((context: interfaces.Context) => {
    return () => {
      return teamRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<Factory<IUserRepository>>(TYPES.UserRepositoryFactory)
  .toFactory<IUserRepository>((context: interfaces.Context) => {
    return () => {
      return userRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<Factory<IVerificationTokenRepository>>(TYPES.VerificationTokenFactory)
  .toFactory<IVerificationTokenRepository>((context: interfaces.Context) => {
    return () => {
      return verificationTokenRepositoryFactory(
        context.container.get(TYPES.dataSource),
        sharedCryptoService
      );
    };
  });

container
  .bind<Factory<IAuthenticationTokenRepository>>(
    TYPES.AuthenticationTokenFactory
  )
  .toFactory<IAuthenticationTokenRepository>((context: interfaces.Context) => {
    return () => {
      return authenticationTokenRepositoryFactory(
        context.container.get(TYPES.dataSource),
        sharedCryptoService
      );
    };
  });

export { container, TYPES };

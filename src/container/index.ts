import { Container, interfaces } from "inversify";
import { DataSource } from "typeorm";

import { TYPES } from "./types";
import {
  ICryptoService,
  CryptoService,
  IMailerService,
  MailerService,
  CustomAuthChecker,
  IAuthChecker,
} from "../services";
import { UserResolver, TeamResolver, TeamPlayerResolver } from "../resolvers";
import { appConfig, IAppConfig } from "../config";
import {
  AppDataSource,
  authenticationTokenRepositoryFactory,
  IAuthenticationTokenRepository,
  ITeamRepository,
  IUserRepository,
  IVerificationTokenRepository,
  IUserToTeamRepository,
  teamRepositoryFactory,
  userRepositoryFactory,
  verificationTokenRepositoryFactory,
  userToTeamRepositoryFactory,
} from "../datalayer";
import { AppContext } from "../context";

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
container.bind<IAuthChecker>(TYPES.CustomAuthChecker).to(CustomAuthChecker);

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
  .bind<interfaces.Factory<ITeamRepository>>(TYPES.TeamRepositoryFactory)
  .toFactory<ITeamRepository>((context: interfaces.Context) => {
    return () => {
      return teamRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<IUserRepository>>(TYPES.UserRepositoryFactory)
  .toFactory<IUserRepository>((context: interfaces.Context) => {
    return () => {
      return userRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<IUserToTeamRepository>>(
    TYPES.UserToTeamRepositoryFactory
  )
  .toFactory<IUserToTeamRepository>((context: interfaces.Context) => {
    return () => {
      return userToTeamRepositoryFactory(
        context.container.get(TYPES.dataSource)
      );
    };
  });

container
  .bind<interfaces.Factory<IVerificationTokenRepository>>(
    TYPES.VerificationTokenFactory
  )
  .toFactory<IVerificationTokenRepository>((context: interfaces.Context) => {
    return () => {
      return verificationTokenRepositoryFactory(
        context.container.get(TYPES.dataSource),
        sharedCryptoService
      );
    };
  });

container
  .bind<interfaces.Factory<IAuthenticationTokenRepository>>(
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

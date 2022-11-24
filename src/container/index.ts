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
import {
  UserResolver,
  TeamResolver,
  TeamInSeasonResolver,
  OrganizationResolver,
  PlayerResolver,
} from "../resolvers";
import { appConfig, IAppConfig } from "../config";
import {
  AppDataSource,
  IAuthenticationTokenRepository,
  IDivisionRepository,
  IFixtureRepository,
  IOrganizationRepository,
  IPlayerRepository,
  IRoleRepository,
  ISeasonRepository,
  ITeamRepository,
  ITeamInSeasonRepository,
  IUserRepository,
  IVerificationTokenRepository,
  authenticationTokenRepositoryFactory,
  divisionRepositoryFactory,
  organizationRepositoryFactory,
  playerRepositoryFactory,
  roleRepositoryFactory,
  seasonRepositoryFactory,
  teamRepositoryFactory,
  userRepositoryFactory,
  verificationTokenRepositoryFactory,
  teamInSeasonRepositoryFactory,
  fixtureRepositoryFactory,
} from "../datalayer";

const container = new Container({ skipBaseClassChecks: true });
// Constants
const sharedCryptoService = new CryptoService(appConfig); // we use a shared instance, so we can generate an iv each time
container
  .bind<ICryptoService>(TYPES.cryptoService)
  .toConstantValue(sharedCryptoService);
container.bind<IAppConfig>(TYPES.appConfig).toConstantValue(appConfig);
container.bind<DataSource>(TYPES.dataSource).toConstantValue(AppDataSource);

// Resolvers
container.bind<UserResolver>(UserResolver).to(UserResolver).inSingletonScope();
container
  .bind<OrganizationResolver>(OrganizationResolver)
  .to(OrganizationResolver)
  .inSingletonScope();

container.bind<TeamResolver>(TeamResolver).to(TeamResolver).inSingletonScope();
container
  .bind<TeamInSeasonResolver>(TeamInSeasonResolver)
  .to(TeamInSeasonResolver)
  .inSingletonScope();

container
  .bind<PlayerResolver>(PlayerResolver)
  .to(PlayerResolver)
  .inSingletonScope();

// Services
container.bind<IMailerService>(TYPES.MailerService).to(MailerService);
container.bind<IAuthChecker>(TYPES.CustomAuthChecker).to(CustomAuthChecker);

// Factories

// These repositories are bound as factories because they require the data source to have been initialized, the factories return singleton instances

container
  .bind<interfaces.Factory<IDivisionRepository>>(
    TYPES.DivisionRepositoryFactory
  )
  .toFactory<IDivisionRepository>((context: interfaces.Context) => {
    return () => {
      return divisionRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<IFixtureRepository>>(TYPES.FixtureRepositoryFactory)
  .toFactory<IFixtureRepository>((context: interfaces.Context) => {
    return () => {
      return fixtureRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<IOrganizationRepository>>(
    TYPES.OrganizationRepositoryFactory
  )
  .toFactory<IOrganizationRepository>((context: interfaces.Context) => {
    return () => {
      return organizationRepositoryFactory(
        context.container.get(TYPES.dataSource),
        context.container.get(TYPES.DivisionRepositoryFactory)
      );
    };
  });

container
  .bind<interfaces.Factory<IPlayerRepository>>(TYPES.PlayerRepositoryFactory)
  .toFactory<IPlayerRepository>((context: interfaces.Context) => {
    return () => {
      return playerRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<IUserRepository>>(TYPES.RoleRepositoryFactory)
  .toFactory<IRoleRepository>((context: interfaces.Context) => {
    return () => {
      return roleRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<ISeasonRepository>>(TYPES.SeasonRepositoryFactory)
  .toFactory<ISeasonRepository>((context: interfaces.Context) => {
    return () => {
      return seasonRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<ITeamRepository>>(TYPES.TeamRepositoryFactory)
  .toFactory<ITeamRepository>((context: interfaces.Context) => {
    return () => {
      return teamRepositoryFactory(context.container.get(TYPES.dataSource));
    };
  });

container
  .bind<interfaces.Factory<ITeamInSeasonRepository>>(
    TYPES.TeamInSeasonRepositoryFactory
  )
  .toFactory<ITeamInSeasonRepository>((context: interfaces.Context) => {
    return () => {
      return teamInSeasonRepositoryFactory(
        context.container.get(TYPES.dataSource)
      );
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

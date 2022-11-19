import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { inject, injectable } from "inversify";
import { Logger } from "winston";

import { ICryptoService, IMailerService } from "../../services";
import {
  IAuthenticationTokenRepository,
  IPlayerRepository,
  IUserRepository,
  IVerificationTokenRepository,
  PlayerModel,
  RoleModel,
  SeasonModel,
  UserModel,
} from "../../datalayer";

@Resolver(() => SeasonModel)
@injectable()
export class SeasonResolver implements ResolverInterface<SeasonModel> {}

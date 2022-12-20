import { inject, injectable } from "inversify";
import { AppContextSessionUserObject } from "../../context";
import {
  IPlayerRepository,
  ITeamRepository,
  IUserRepository,
  PlayerModel,
  TRoleName,
  UserModel,
} from "../../datalayer";

export interface IAuthorizationService {
  doesSessionUserUserHaveRole(
    sessionUser: AppContextSessionUserObject,
    roleName: TRoleName
  ): boolean;
  doesUserHaveRole(user: UserModel, roleName: TRoleName): Promise<boolean>;
  doesPlayerOnTeamHaveTeamRole(
    player: PlayerModel,
    teamRoleName: TRoleName
  ): Promise<boolean>;
}

@injectable()
class AuthorizationService implements IAuthorizationService {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("PlayerRepositoryFactory")
  private playerRepositoryFactory!: () => IPlayerRepository;

  doesPlayerOnTeamHaveTeamRole(
    player: PlayerModel,
    teamRoleName: TRoleName
  ): Promise<boolean> {
    return Promise.resolve(false);
  }

  doesSessionUserUserHaveRole(
    sessionUser: AppContextSessionUserObject,
    roleName: TRoleName
  ): boolean {
    if (!sessionUser.roles) {
      return false;
    }
    return sessionUser.roles.includes(roleName);
  }

  doesUserHaveRole(user: UserModel, roleName: TRoleName): Promise<boolean> {
    return Promise.resolve(false);
  }
}

export { AuthorizationService };

import { FieldResolver, Resolver, Root } from "type-graphql";
import { inject, injectable } from "inversify";
import {
  ITeamRepository,
  IUserRepository,
  TeamModel,
  UserModel,
  UserToTeamModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => UserToTeamModel)
@injectable()
export class TeamPlayerResolver {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("logger")
  private logger!: Logger;

  @FieldResolver(() => UserModel)
  async user(@Root() teamPlayer: UserToTeamModel): Promise<UserModel> {
    return this.userRepositoryFactory().findOneOrFail({
      where: { id: teamPlayer.userId },
    });
  }

  @FieldResolver(() => TeamModel)
  async team(@Root() teamPlayer: UserToTeamModel): Promise<TeamModel> {
    return this.teamRepositoryFactory().findOneOrFail({
      where: { id: teamPlayer.teamId },
    });
  }
}

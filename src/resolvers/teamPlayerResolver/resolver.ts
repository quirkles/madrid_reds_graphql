import {
  Arg,
  FieldResolver,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { inject, injectable } from "inversify";
import {
  ITeamRepository,
  IUserRepository,
  IUserToTeamRepository,
  TeamModel,
  UserModel,
  UserToTeamModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => UserToTeamModel)
@injectable()
export class TeamPlayerResolver implements ResolverInterface<UserToTeamModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("UserToTeamRepositoryFactory")
  private userToTeamRepositoryFactory!: () => IUserToTeamRepository;

  @inject("logger")
  private logger!: Logger;

  @Query(() => UserToTeamModel, { name: "player" })
  async getPlayer(@Arg("id") id: string): Promise<UserToTeamModel> {
    const repo = this.userToTeamRepositoryFactory();
    return repo.findOneOrFail({ where: { id } });
  }

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

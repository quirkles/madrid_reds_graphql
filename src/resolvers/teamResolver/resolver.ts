import {
  Arg,
  Args,
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
  UserToTeamModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => TeamModel)
@injectable()
class TeamResolver implements ResolverInterface<TeamModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("UserToTeamRepositoryFactory")
  private userToTeamRepositoryFactory!: () => IUserToTeamRepository;

  @inject("logger")
  private logger!: Logger;

  @Query(() => TeamModel, { name: "team" })
  protected async getTeam(@Arg("id") id: string) {
    const repo = this.teamRepositoryFactory();
    return repo.findOneBy({ id });
  }

  @FieldResolver(() => [UserToTeamModel], { name: "players" })
  async userToTeams(@Root() team: TeamModel): Promise<UserToTeamModel[]> {
    const repo = this.userToTeamRepositoryFactory();
    return repo.find({
      where: { teamId: team.id },
    });
  }
}

export { TeamResolver };

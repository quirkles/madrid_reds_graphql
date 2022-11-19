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
  TeamModel,
  TeamInSeasonModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => TeamModel)
@injectable()
class TeamResolver implements ResolverInterface<TeamModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("logger")
  private logger!: Logger;

  @Query(() => TeamModel, { name: "team" })
  protected async getTeam(@Arg("id") id: string) {
    const repo = this.teamRepositoryFactory();
    return repo.findOneBy({ id });
  }

  @FieldResolver(() => [TeamInSeasonModel])
  async seasons(@Root() root: TeamModel): Promise<TeamInSeasonModel[]> {
    const repo = this.teamRepositoryFactory();
    const team = await repo.findOneOrFail({
      where: { id: root.id },
      relations: ["seasons"],
    });
    return team.seasons;
  }
}

export { TeamResolver };

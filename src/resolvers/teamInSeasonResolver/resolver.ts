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
  TeamModel,
  SeasonModel,
  TeamInSeasonModel,
  ISeasonRepository,
  PlayerModel,
  ITeamInSeasonRepository,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => TeamInSeasonModel)
@injectable()
class TeamInSeasonResolver implements ResolverInterface<TeamInSeasonModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("TeamInSeasonRepositoryFactory")
  private teamInSeasonRepositoryFactor!: () => ITeamInSeasonRepository;

  @inject("SeasonRepositoryFactory")
  private seasonRepositoryFactory!: () => ISeasonRepository;

  @inject("logger")
  private logger!: Logger;

  @Query(() => TeamModel, { name: "team" })
  protected async getTeam(@Arg("id") id: string) {
    const repo = this.teamRepositoryFactory();
    return repo.findOneBy({ id });
  }

  @FieldResolver(() => SeasonModel)
  async season(@Root() root: TeamInSeasonModel): Promise<SeasonModel> {
    const repo = this.seasonRepositoryFactory();
    return repo.findOneOrFail({
      where: { id: root.seasonId },
    });
  }

  @FieldResolver(() => TeamModel)
  async team(@Root() root: TeamInSeasonModel): Promise<TeamModel> {
    const repo = this.teamRepositoryFactory();
    return repo.findOneOrFail({
      where: { id: root.teamId },
    });
  }

  @FieldResolver(() => [PlayerModel])
  async players(@Root() root: TeamInSeasonModel): Promise<PlayerModel[]> {
    const repo = this.teamInSeasonRepositoryFactor();
    return repo.getPlayers(root.id);
  }
}

export { TeamInSeasonResolver };

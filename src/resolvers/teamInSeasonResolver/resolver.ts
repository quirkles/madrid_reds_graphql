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
  IFixtureRepository,
  ISeasonRepository,
  ITeamRepository,
  ITeamInSeasonRepository,
  PlayerModel,
  SeasonModel,
  TeamModel,
  TeamInSeasonModel,
} from "../../datalayer";
import { Logger } from "winston";
import { Result } from "./responseTypes";

@Resolver(() => TeamInSeasonModel)
@injectable()
class TeamInSeasonResolver implements ResolverInterface<TeamInSeasonModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("TeamInSeasonRepositoryFactory")
  private teamInSeasonRepositoryFactor!: () => ITeamInSeasonRepository;

  @inject("SeasonRepositoryFactory")
  private seasonRepositoryFactory!: () => ISeasonRepository;

  @inject("FixtureRepositoryFactory")
  private fixtureRepositoryFactory!: () => IFixtureRepository;

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

  @FieldResolver(() => [Result])
  async results(@Root() root: TeamInSeasonModel): Promise<Result[]> {
    const repo = this.fixtureRepositoryFactory();
    return repo.findMatchesForTeam(root.id);
  }
}

export { TeamInSeasonResolver };

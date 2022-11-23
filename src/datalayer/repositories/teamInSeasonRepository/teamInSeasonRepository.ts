import { DataSource, Repository } from "typeorm";
import { PlayerModel, TeamInSeasonModel } from "../../models";

export type ITeamInSeasonRepository = Repository<TeamInSeasonModel> & {
  getPlayers(teamInSeasonId: string): Promise<PlayerModel[]>;
};

let repoSingleton: ITeamInSeasonRepository;

export function teamInSeasonRepositoryFactory(
  datasource: DataSource
): ITeamInSeasonRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(TeamInSeasonModel).extend({
      getPlayers(teamInSeasonId: string): Promise<PlayerModel[]> {
        return this.findOneOrFail({
          where: { id: teamInSeasonId },
          relations: ["players"],
        }).then((t) => t.players || []);
      },
    });
  }
  return repoSingleton;
}

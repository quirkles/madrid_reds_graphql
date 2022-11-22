import { DataSource, Repository } from "typeorm";
import { FixtureModel } from "../models";
import { Result } from "../../resolvers/teamInSeasonResolver/responseTypes";

export type IFixtureRepository = Repository<FixtureModel> & {
  findMatchesForTeam(teamId: string): Promise<Result[]>;
};

let repoSingleton: IFixtureRepository;

export function fixtureRepositoryFactory(
  datasource: DataSource
): IFixtureRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(FixtureModel).extend({
      async findMatchesForTeam(teamId: string): Promise<Result[]> {
        const data = await this.createQueryBuilder("fixture")
          .leftJoinAndSelect("fixture.homeTeam", "homeTeam")
          .leftJoinAndSelect("homeTeam.team", "homeTeamDetails")
          .leftJoinAndSelect("fixture.awayTeam", "awayTeam")
          .leftJoinAndSelect("awayTeam.team", "awayTeamDetails")
          .leftJoinAndSelect("homeTeam.season", "season")
          .leftJoinAndSelect("fixture.gameEvents", "gameEvents")
          .leftJoinAndSelect("gameEvents.eventType", "eventType")
          .leftJoinAndSelect("gameEvents.player", "player")
          .leftJoinAndSelect("player.user", "user")
          .leftJoinAndSelect("player.teamInSeason", "ge_team")
          .leftJoinAndSelect("ge_team.team", "ge_team_data")
          .where("fixture.homeTeamId = :homeTeamId", {
            homeTeamId: teamId,
          })
          .orWhere("fixture.awayTeamId = :homeTeamId", {
            awayTeamId: teamId,
          })
          .getMany();
        return [];
      },
    });
  }
  return repoSingleton;
}

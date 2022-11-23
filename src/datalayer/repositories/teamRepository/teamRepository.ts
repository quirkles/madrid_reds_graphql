import { DataSource, Repository } from "typeorm";
import { TeamModel } from "../../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITeamRepository extends Repository<TeamModel> {}

let repoSingleton: ITeamRepository;

export function teamRepositoryFactory(datasource: DataSource): ITeamRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(TeamModel).extend({});
  }
  return repoSingleton;
}

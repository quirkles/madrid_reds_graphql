import { DataSource, Repository } from "typeorm";
import { SeasonModel } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISeasonRepository extends Repository<SeasonModel> {}

let repoSingleton: ISeasonRepository;

export function seasonRepositoryFactory(
  datasource: DataSource
): ISeasonRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(SeasonModel).extend({});
  }
  return repoSingleton;
}

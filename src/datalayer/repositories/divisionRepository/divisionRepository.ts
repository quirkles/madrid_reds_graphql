import { DataSource, Repository } from "typeorm";
import { DivisionModel } from "../../models";

export type IDivisionRepository = Repository<DivisionModel>;

let repoSingleton: IDivisionRepository;

export function divisionRepositoryFactory(
  datasource: DataSource
): IDivisionRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(DivisionModel).extend({});
  }
  return repoSingleton;
}

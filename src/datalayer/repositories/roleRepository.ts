import { DataSource, Repository } from "typeorm";
import { RoleModel, UserToTeamModel } from "../models";

export type IRoleRepository = Repository<RoleModel>;

let repoSingleton: IRoleRepository;

export function roleRepositoryFactory(datasource: DataSource): IRoleRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(RoleModel).extend({});
  }
  return repoSingleton;
}

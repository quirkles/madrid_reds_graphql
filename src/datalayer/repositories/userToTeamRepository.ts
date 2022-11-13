import { DataSource, Repository } from "typeorm";
import { UserToTeamModel } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserToTeamRepository extends Repository<UserToTeamModel> {}

let repoSingleton: IUserToTeamRepository;

export function userToTeamRepositoryFactory(
  datasource: DataSource
): IUserToTeamRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(UserToTeamModel).extend({});
  }
  return repoSingleton;
}

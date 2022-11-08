import { DataSource, Repository } from "typeorm";
import { UserModel } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository extends Repository<UserModel> {}

let repoSingleton: IUserRepository;

export function userRepositoryFactory(datasource: DataSource): IUserRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(UserModel).extend({});
  }
  return repoSingleton;
}

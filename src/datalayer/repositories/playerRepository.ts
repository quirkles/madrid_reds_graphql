import { DataSource, Repository } from "typeorm";
import { PlayerModel } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlayerRepository extends Repository<PlayerModel> {}

let repoSingleton: IPlayerRepository;

export function playerRepositoryFactory(
  datasource: DataSource
): IPlayerRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(PlayerModel).extend({});
  }
  return repoSingleton;
}

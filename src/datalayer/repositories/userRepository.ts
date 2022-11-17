import { DataSource, Repository } from "typeorm";
import { RoleModel, UserModel } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type IUserRepository = Repository<UserModel> & {
  findRoles(userId: string): Promise<RoleModel[]>;
};

let repoSingleton: IUserRepository;

export function userRepositoryFactory(datasource: DataSource): IUserRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(UserModel).extend({
      async findRoles(userId: string): Promise<RoleModel[]> {
        const user = await this.findOne({
          where: {
            id: userId,
          },
          relations: ["roles", "roles.scope"],
        });
        return user?.roles || [];
      },
    });
  }
  return repoSingleton;
}

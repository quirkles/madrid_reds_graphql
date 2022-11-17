import { DataSource, Repository } from "typeorm";
import { RoleModel, UserToTeamModel } from "../models";

export type IUserToTeamRepository = Repository<UserToTeamModel> & {
  findTeamRoles(userId: string, teamId: string): Promise<RoleModel[]>;
};

let repoSingleton: IUserToTeamRepository;

export function userToTeamRepositoryFactory(
  datasource: DataSource
): IUserToTeamRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(UserToTeamModel).extend({
      async findTeamRoles(
        userId: string,
        teamId: string
      ): Promise<RoleModel[]> {
        const userTeamRepo =
          datasource.getRepository<UserToTeamModel>(UserToTeamModel);
        const userTeam = await userTeamRepo.findOne({
          where: {
            userId,
            teamId,
          },
          relations: ["roles", "roles.scope"],
        });
        return userTeam?.roles || [];
      },
    });
  }
  return repoSingleton;
}

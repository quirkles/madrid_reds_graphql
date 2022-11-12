import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { inject, injectable } from "inversify";
import {
  ITeamRepository,
  IUserRepository,
  TeamModel,
  UserToTeamModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => TeamModel)
@injectable()
export class TeamResolver {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("logger")
  private logger!: Logger;

  @Query(() => TeamModel)
  async team(@Arg("id") id: string) {
    const teamRepo = this.teamRepositoryFactory();
    return teamRepo.findOneBy({ id });
  }

  @FieldResolver(() => UserToTeamModel)
  async players(@Root() team: TeamModel): Promise<UserToTeamModel[]> {
    const teamModel = await this.teamRepositoryFactory().findOneOrFail({
      where: { id: team.id },
      relations: ["userToTeams"],
    });
    return teamModel.userToTeams;
  }
}

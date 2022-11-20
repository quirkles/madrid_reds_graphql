import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { inject, injectable } from "inversify";
import {
  ITeamRepository,
  IUserRepository,
  PlayerModel,
  ISeasonRepository,
  TeamInSeasonModel,
  IPlayerRepository,
  UserModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => PlayerModel)
@injectable()
class PlayerResolver implements ResolverInterface<PlayerModel> {
  @inject("TeamRepositoryFactory")
  private teamRepositoryFactory!: () => ITeamRepository;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("SeasonRepositoryFactory")
  private seasonRepositoryFactory!: () => ISeasonRepository;

  @inject("PlayerRepositoryFactory")
  private playerRepositoryFactory!: () => IPlayerRepository;

  @inject("logger")
  private logger!: Logger;

  @FieldResolver(() => TeamInSeasonModel, { name: "team" })
  async teamInSeason(@Root() root: PlayerModel): Promise<TeamInSeasonModel> {
    const repo = this.playerRepositoryFactory();
    return repo
      .findOneOrFail({
        where: { id: root.id },
        relations: ["teamInSeason"],
      })
      .then((p) => p.teamInSeason);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() root: PlayerModel): Promise<UserModel> {
    const repo = this.playerRepositoryFactory();
    return repo
      .findOneOrFail({
        where: { id: root.id },
        relations: ["user"],
      })
      .then((p) => p.user);
  }
}

export { PlayerResolver };

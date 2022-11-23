import { Field, ObjectType } from "type-graphql";
import { PlayerModel, SeasonModel, TeamInSeasonModel } from "../../datalayer";

@ObjectType()
export class GoalEvent {
  @Field(() => PlayerModel)
  player!: PlayerModel;

  @Field(() => Number)
  gameTime!: number;
}

@ObjectType()
export class TeamResult {
  @Field(() => TeamInSeasonModel)
  team!: TeamInSeasonModel;

  @Field(() => [GoalEvent])
  goals!: GoalEvent[];
}

@ObjectType()
export class Result {
  @Field(() => String)
  scoreLine!: string;

  @Field(() => TeamResult)
  homeTeam!: TeamResult;

  @Field(() => TeamResult)
  awayTeam!: TeamResult;

  @Field(() => SeasonModel)
  season!: SeasonModel;

  @Field(() => Date)
  date?: Date;
}

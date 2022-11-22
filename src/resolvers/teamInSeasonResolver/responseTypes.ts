import { Field, ObjectType } from "type-graphql";
import { SeasonModel, TeamInSeasonModel } from "../../datalayer";

@ObjectType()
class TeamResult {
  @Field(() => TeamInSeasonModel)
  team!: TeamInSeasonModel;

  @Field(() => Number)
  goals!: number;
}

@ObjectType()
export class Result {
  @Field(() => TeamResult)
  homeTeam!: TeamResult;

  @Field(() => TeamResult)
  awayTeam!: TeamResult;

  @Field(() => SeasonModel)
  season!: SeasonModel;

  @Field(() => Date)
  date?: Date;
}

import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { DivisionModel } from "./divisionModel";
import { FixtureModel } from "./fixtureModel";
import { TeamInSeasonModel } from "./teamInSeasonModel";

@Entity({ name: "season" })
@ObjectType("Season", {
  description:
    "A specific set of games comprising a season long competition for a division title",
})
export class SeasonModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => Date)
  @Column()
  startDate!: Date;

  @Field(() => Date)
  @Column()
  endDate!: Date;

  @Field(() => DivisionModel)
  @ManyToOne(() => DivisionModel, (division) => division.seasons)
  division!: DivisionModel;

  @Field(() => [FixtureModel])
  @ManyToMany(() => FixtureModel, (fixture) => fixture.season)
  fixtures!: FixtureModel[];

  @Field(() => [TeamInSeasonModel])
  @ManyToOne(
    () => TeamInSeasonModel,
    (TeamInSeasonModel) => TeamInSeasonModel.season
  )
  teams!: TeamInSeasonModel[];
}

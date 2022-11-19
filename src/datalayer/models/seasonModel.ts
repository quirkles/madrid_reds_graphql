import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { DivisionModel } from "./divisionModel";
import { TeamModel } from "./teamModel";
import { PlayerModel } from "./playerModel";
import { FixtureModel } from "./fixtureModel";

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

  @Field(() => [PlayerModel])
  @OneToMany(() => PlayerModel, (player) => player.season)
  players!: PlayerModel[];

  @Field(() => [FixtureModel])
  @ManyToMany(() => FixtureModel, (fixture) => fixture.season)
  fixtures!: FixtureModel[];

  @Field(() => [TeamModel])
  @ManyToMany(() => TeamModel, (team) => team.seasons)
  teams!: TeamModel[];
}

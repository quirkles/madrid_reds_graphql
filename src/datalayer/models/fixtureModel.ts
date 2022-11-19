import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { GameEventModel } from "./gameEventModel";
import { SeasonModel } from "./seasonModel";
import { TeamInSeasonModel } from "./teamInSeasonModel";

@Entity({ name: "fixture" })
@ObjectType("Fixture", {})
export class FixtureModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  homeTeamId!: string;

  @Field(() => String)
  @Column()
  awayTeamId!: string;

  @Field(() => Date)
  @Column()
  date!: Date;

  @Field(() => SeasonModel)
  @ManyToOne(() => SeasonModel, (season) => season.fixtures)
  season!: SeasonModel;

  @Field(() => TeamInSeasonModel)
  @ManyToOne(() => TeamInSeasonModel, (team) => team.awayFixtures)
  awayTeam!: TeamInSeasonModel;

  @Field(() => TeamInSeasonModel)
  @ManyToOne(() => TeamInSeasonModel, (team) => team.homeFixtures)
  homeTeam!: TeamInSeasonModel;

  @Field(() => [GameEventModel])
  @OneToMany(() => GameEventModel, (event) => event.fixture)
  gameEvents!: GameEventModel[];
}

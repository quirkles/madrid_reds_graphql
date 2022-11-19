import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { TeamModel } from "./teamModel";
import { GameEventModel } from "./gameEventModel";
import { SeasonModel } from "./seasonModel";

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

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.awayFixtures)
  awayTeam!: TeamModel;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.homeFixtures)
  homeTeam!: TeamModel;

  @Field(() => [GameEventModel])
  @OneToMany(() => GameEventModel, (event) => event.fixture)
  gameEvents!: GameEventModel[];
}

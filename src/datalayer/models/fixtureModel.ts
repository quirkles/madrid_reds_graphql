import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { TeamToLeagueModel } from "./teamToLeagueModel";
import { GameEventModel } from "./gameEventModel";

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

  @ManyToOne(() => TeamToLeagueModel, (team) => team.fixturesAsAwayTeam)
  awayTeam!: TeamToLeagueModel;

  @ManyToOne(() => TeamToLeagueModel, (team) => team.fixturesAsAwayTeam)
  homeTeam!: TeamToLeagueModel;

  @Field(() => [GameEventModel])
  @OneToMany(() => GameEventModel, (event) => event.fixture)
  gameEvents!: GameEventModel[];
}

import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { SeasonModel } from "./seasonModel";
import { PlayerModel } from "./playerModel";
import { FixtureModel } from "./fixtureModel";

@Entity({ name: "team" })
@ObjectType("Team", {})
export class TeamModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [SeasonModel])
  @JoinTable()
  @ManyToMany(() => SeasonModel, (season) => season.teams)
  seasons!: SeasonModel[];

  @Field(() => [PlayerModel])
  @JoinTable()
  @ManyToMany(() => PlayerModel, (player) => player.team)
  players!: PlayerModel[];

  @Field(() => [FixtureModel])
  @OneToMany(() => FixtureModel, (fixture) => fixture.homeTeam)
  homeFixtures!: FixtureModel[];

  @Field(() => [FixtureModel])
  @OneToMany(() => FixtureModel, (fixture) => fixture.awayTeam)
  awayFixtures!: FixtureModel[];
}

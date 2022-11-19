import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { SeasonModel } from "./seasonModel";
import { PlayerModel } from "./playerModel";
import { FixtureModel } from "./fixtureModel";
import { TeamModel } from "./teamModel";

@Entity({ name: "team_in_season" })
@ObjectType("TeamInSeason", {})
export class TeamInSeasonModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  teamId!: string;

  @Field(() => String)
  @Column()
  seasonId!: string;

  @Field(() => SeasonModel)
  @ManyToOne(() => SeasonModel, (season) => season.teams)
  season!: SeasonModel;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.seasons)
  team!: TeamModel;

  @Field(() => [PlayerModel])
  @JoinTable()
  @OneToMany(() => PlayerModel, (player) => player.teamInSeason)
  players!: PlayerModel[];

  @Field(() => [FixtureModel])
  @OneToMany(() => FixtureModel, (fixture) => fixture.homeTeam)
  homeFixtures!: FixtureModel[];

  @Field(() => [FixtureModel])
  @OneToMany(() => FixtureModel, (fixture) => fixture.awayTeam)
  awayFixtures!: FixtureModel[];
}

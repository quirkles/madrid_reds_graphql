import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { TeamModel } from "./teamModel";
import { LeagueModel } from "./leagueModel";
import { FixtureModel } from "./fixtureModel";

@Entity({ name: "team_to_league" })
@ObjectType("TeamToLeague", {
  description: "A teams specific appearance in a league.",
})
export class TeamToLeagueModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field(() => ID)
  @Column()
  public teamId!: string;

  @Field(() => ID)
  @Column()
  public leagueId!: string;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.leagues)
  public team!: TeamModel;

  @Field(() => LeagueModel)
  @ManyToOne(() => LeagueModel, (league) => league.teams)
  public league!: LeagueModel;

  @OneToMany(() => FixtureModel, (fixture) => fixture.homeTeam)
  fixturesAsHomeTeam!: FixtureModel[];

  @OneToMany(() => FixtureModel, (fixture) => fixture.awayTeam)
  fixturesAsAwayTeam!: FixtureModel[];
}

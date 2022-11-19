import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserToTeamModel } from "./userToTeamModel";
import { DivisionModel } from "./divisionModel";
import { TeamToLeagueModel } from "./teamToLeagueModel";

@Entity({ name: "league" })
@ObjectType("League", {
  description: "A specific set of games comprising a league competition",
})
export class LeagueModel extends BaseEntity {
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
  @ManyToOne(() => DivisionModel, (division) => division.leagues)
  public division!: DivisionModel;

  @Field(() => [DivisionModel])
  @OneToMany(() => DivisionModel, (division) => division.organization)
  divisions!: UserToTeamModel[];

  @Field(() => [TeamToLeagueModel])
  @OneToMany(() => TeamToLeagueModel, (teamToLeague) => teamToLeague.league)
  teams!: TeamToLeagueModel[];
}

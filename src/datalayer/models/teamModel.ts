import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserToTeamModel } from "./userToTeamModel";
import { TeamToLeagueModel } from "./teamToLeagueModel";

@Entity({ name: "team" })
@ObjectType("Team", {})
export class TeamModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [UserToTeamModel], { name: "players" })
  @OneToMany(() => UserToTeamModel, (userToTeam) => userToTeam.team)
  userToTeams!: UserToTeamModel[];

  @Field(() => [TeamToLeagueModel])
  @OneToMany(() => TeamToLeagueModel, (teamToLeague) => teamToLeague.team)
  leagues!: TeamToLeagueModel[];
}

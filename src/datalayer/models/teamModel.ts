import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  AfterLoad,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserToTeamModel } from "./userToTeamModel";

@Entity({ name: "team" })
@ObjectType("Team", {})
export class TeamModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @OneToMany(() => UserToTeamModel, (userToTeam) => userToTeam.team)
  @Field(() => [UserToTeamModel], { name: "players" })
  userToTeams!: UserToTeamModel[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { ObjectType } from "type-graphql";
import { UserModel } from "./userModel";
import { TeamModel } from "./teamModel";

@Entity({ name: "user_to_team" })
@ObjectType("UserToTeam", {})
export class UserToTeamModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public position!: string;

  @ManyToOne(() => UserModel, (user) => user.userToTeams)
  public user!: UserModel;

  @ManyToOne(() => TeamModel, (team) => team.userToTeams)
  public team!: TeamModel;
}

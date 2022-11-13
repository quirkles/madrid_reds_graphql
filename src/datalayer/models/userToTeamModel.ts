import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { UserModel } from "./userModel";
import { TeamModel } from "./teamModel";

@Entity({ name: "user_to_team" })
@ObjectType("TeamPlayer", {})
export class UserToTeamModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: string;

  @Field(() => String)
  @Column()
  public position!: string;

  @Field(() => ID)
  @Column()
  public userId!: string;

  @Field(() => ID)
  @Column()
  public teamId!: string;

  @Field(() => UserModel)
  @ManyToOne(() => UserModel, (user) => user.userToTeams)
  public user!: UserModel;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.userToTeams)
  public team!: TeamModel;
}

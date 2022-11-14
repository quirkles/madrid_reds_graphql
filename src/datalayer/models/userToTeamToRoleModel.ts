import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { UserToTeamModel } from "./userToTeamModel";

@Entity({ name: "user_to_team_to_role" })
@ObjectType("TeamPlayerRole", {})
export class UserToTeamToRoleModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: string;

  @Field(() => ID)
  @Column()
  public userId!: string;

  @Field(() => ID)
  @Column()
  public roleId!: string;

  @Field(() => UserToTeamModel)
  @ManyToOne(
    () => UserToTeamModel,
    (userToTeamModel) => userToTeamModel.userTeamRoles
  )
  public userToTeamModel!: UserToTeamModel;
}

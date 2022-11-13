import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { RoleName } from "../../services";
import { UserModel } from "./userModel";
import { RoleModel } from "./roleModel";

registerEnumType(RoleName, {
  name: "RoleName", // this one is mandatory
  description: "The roles a user can have", // this one is optional
});

@Entity({ name: "user_to_role" })
@ObjectType("RoleForUser", {})
export class UserToRoleModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: string;

  @Field(() => ID)
  @Column()
  public userId!: string;

  @Field(() => ID)
  @Column()
  public roleId!: string;

  @Field(() => UserModel)
  @ManyToOne(() => UserModel, (user) => user.userToTeams)
  public user!: UserModel;

  @Field(() => RoleModel)
  @ManyToOne(() => RoleModel, (role) => role.usersWithRole)
  public role!: RoleModel;
}

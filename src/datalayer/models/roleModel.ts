import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { RoleName } from "../../services";
import { UserToRoleModel } from "./userToRoleModel";

registerEnumType(RoleName, {
  name: "RoleName", // this one is mandatory
  description: "The roles a user can have", // this one is optional
});

@Entity({ name: "role" })
@ObjectType("Role", {})
export class RoleModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => RoleName)
  @Column({ nullable: false, unique: true })
  roleName!: string;

  @Field(() => [UserToRoleModel], { name: "usersWithRole" })
  @OneToMany(() => UserToRoleModel, (userToRole) => userToRole.user)
  usersWithRole!: UserToRoleModel[];
}

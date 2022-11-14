import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { UserToRoleModel } from "./userToRoleModel";
import { RoleScopeModel } from "./roleScope";

export const RoleName = {
  ANYONE: "ANYONE",
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = typeof RoleName[keyof typeof RoleName];

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

  @Field(() => RoleScopeModel)
  @ManyToOne(() => RoleScopeModel, (scope) => scope.roles)
  scope!: RoleScopeModel;

  @Field(() => [UserToRoleModel], { name: "usersWithRole" })
  @OneToMany(() => UserToRoleModel, (userToRole) => userToRole.user)
  usersWithRole!: UserToRoleModel[];
}

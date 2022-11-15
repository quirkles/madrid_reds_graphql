import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { RoleModel } from "./roleModel";

export const RoleScopeName = {
  SITE: "SITE",
  TEAM: "TEAM",
} as const;
export type RoleScope = typeof RoleScopeName[keyof typeof RoleScopeName];

registerEnumType(RoleScopeName, {
  name: "RoleScopeName", // this one is mandatory
  description: "The scope of a role", // this one is optional
});

@Entity({ name: "role_scope" })
@ObjectType("RoleScope", {})
export class RoleScopeModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => RoleScopeName)
  @Column({ nullable: false, unique: true })
  scopeName!: string;

  @Field(() => [RoleModel], { name: "rolesInScope" })
  @OneToMany(() => RoleModel, (role) => role.scope)
  roles!: RoleModel[];
}

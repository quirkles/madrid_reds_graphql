import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { RoleScopeModel } from "./roleScope";
import { UserModel } from "./userModel";
import { UserToTeamModel } from "./userToTeamModel";

export const RoleName = {
  ANYONE: "ANYONE",
  USER: "USER",
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
  CAPTAIN: "CAPTAIN",
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

  @Column("string")
  scopeId!: string;

  @Field(() => RoleScopeModel)
  @ManyToOne(() => RoleScopeModel, (scope) => scope.roles)
  scope!: RoleScopeModel;

  @Field(() => [UserModel], { name: "usersWithRole" })
  @ManyToMany(() => UserModel, (user) => user.roles)
  usersWithRole!: UserModel[];

  @Field(() => [UserToTeamModel], { name: "teamPlayersWithRole" })
  @ManyToMany(() => UserToTeamModel, (teamPlayer) => teamPlayer.roles)
  teamPlayersWithRole!: UserToTeamModel[];
}

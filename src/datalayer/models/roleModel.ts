import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { RoleScopeModel } from "./roleScopeModel";
import { UserModel } from "./userModel";
import { PlayerModel } from "./playerModel";

export const RoleName = {
  ANYONE: "ANYONE",
  USER: "USER",
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
  CAPTAIN: "CAPTAIN",
} as const;

export type TRoleName = typeof RoleName[keyof typeof RoleName];

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
  roleName!: TRoleName;

  @Column("string")
  scopeId!: string;

  @Field(() => RoleScopeModel)
  @ManyToOne(() => RoleScopeModel, (scope: RoleScopeModel) => scope.roles)
  scope!: RoleScopeModel;

  @Field(() => [UserModel], { name: "usersWithRole" })
  @ManyToMany(() => UserModel, (user) => user.roles)
  usersWithRole!: UserModel[];

  @Field(() => [PlayerModel], { name: "teamPlayersWithRole" })
  @ManyToMany(() => PlayerModel, (player) => player.roles)
  teamPlayersWithRole!: PlayerModel[];
}

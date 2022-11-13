import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { VerificationTokenModel } from "./verificationTokenModel";
import { AuthenticationTokenModel } from "./authenticationTokenModel";
import { UserToTeamModel } from "./userToTeamModel";
import { RoleModel } from "./roleModel";
import { UserToRoleModel } from "./userToRoleModel";

@Entity({ name: "user" })
@ObjectType("User", {})
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  email!: string;

  @Field(() => String)
  @Column({ nullable: true })
  name!: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isVerified!: boolean;

  @OneToMany(() => VerificationTokenModel, (token) => token.user)
  verificationTokens!: VerificationTokenModel[];

  @OneToMany(() => AuthenticationTokenModel, (token) => token.user)
  authenticationTokens!: AuthenticationTokenModel[];

  @Field(() => [UserToTeamModel], { name: "teamsPlayerIsOn" })
  @OneToMany(() => UserToTeamModel, (userToTeam) => userToTeam.user)
  userToTeams!: UserToTeamModel[];

  @Field(() => [UserToRoleModel], { name: "userRoles" })
  @OneToMany(() => UserToRoleModel, (userToRole) => userToRole.user)
  userRoles!: UserToRoleModel[];
}

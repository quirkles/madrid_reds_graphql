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
import { RoleModel } from "./roleModel";
import { PlayerModel } from "./playerModel";

@Entity({ name: "user" })
@ObjectType("User", {})
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  emailAddress!: string;

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

  @Field(() => [PlayerModel])
  @OneToMany(() => PlayerModel, (player) => player.user)
  seasonsAsPlayer!: PlayerModel[];

  @Field(() => [RoleModel], { name: "roles" })
  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.usersWithRole)
  roles!: RoleModel[];
}

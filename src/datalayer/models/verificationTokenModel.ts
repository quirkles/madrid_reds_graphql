import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { UserModel } from "./userModel";

@Entity({ name: "verification_tokens" })
@ObjectType("VerificationToken", {})
export class VerificationTokenModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column({ nullable: false })
  email!: string;

  @Field(() => String)
  @Column({ nullable: false })
  secret!: string;

  @Field(() => Number)
  @Column({ nullable: false })
  createdAt!: number;

  @Field(() => Number)
  @Column({ nullable: true })
  verifiedAt!: number;

  @ManyToOne(() => UserModel, (user) => user.verificationTokens)
  user!: UserModel;
}

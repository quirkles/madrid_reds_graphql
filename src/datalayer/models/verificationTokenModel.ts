import {Entity, PrimaryGeneratedColumn, Column, ObjectID, BaseEntity, ManyToOne} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import {UserModel} from "./userModel";

@Entity({ name: 'verification_tokens' })
@ObjectType('VerificationToken', {})
export class VerificationTokenModel extends BaseEntity {
    @PrimaryGeneratedColumn({ name: '_id' })
    @Field(() => ID)
      id!: ObjectID

    @Field(() => String)
    @Column({ nullable: false })
      email!: string

    @Field(() => String)
    @Column({ nullable: false })
      iv!: string

    @Field(() => String)
    @Column({ nullable: false })
      token!: string

    @ManyToOne(() => UserModel, (user) => user.verificationTokens)
      user!: UserModel
}

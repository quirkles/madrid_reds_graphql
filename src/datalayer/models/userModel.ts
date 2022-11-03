import { Entity, PrimaryGeneratedColumn, Column, ObjectID, BaseEntity, OneToMany } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { VerificationTokenModel } from './verificationTokenModel'

@Entity({ name: 'users' })
@ObjectType('User', {})
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn({ name: '_id' })
    @Field(() => ID)
      id!: ObjectID

    @Field(() => String)
    @Column({ nullable: true })
      email!: string

    @Field(() => String)
    @Column({ nullable: true })
      name!: string

    @Field(() => Boolean)
    @Column({ nullable: false, default: false })
      isVerified!: boolean

    @OneToMany(() => VerificationTokenModel, (token) => token.user)
      verificationTokens!: VerificationTokenModel[]
}

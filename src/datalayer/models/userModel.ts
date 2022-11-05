import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  AfterLoad,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { VerificationTokenModel } from './verificationTokenModel'

@Entity({ name: 'users' })
@ObjectType('User', {})
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
      id!: string

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

    @AfterLoad()
    async nullChecks () {
      if (!this.verificationTokens) {
        this.verificationTokens = []
      }
    }
}

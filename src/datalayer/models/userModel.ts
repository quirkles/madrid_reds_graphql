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
import { AuthenticationTokenModel } from './authenticationTokenModel'

@Entity({ name: 'users' })
@ObjectType('User', {})
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
      id!: string

    @Field(() => String)
    @Column({ nullable: true, unique: true })
      email!: string

    @Field(() => String)
    @Column({ nullable: true })
      name!: string

    @Field(() => Boolean)
    @Column({ nullable: false, default: false })
      isVerified!: boolean

    @OneToMany(() => VerificationTokenModel, (token) => token.user)
      verificationTokens!: VerificationTokenModel[]

    @OneToMany(() => AuthenticationTokenModel, (token) => token.user)
      authenticationTokens!: AuthenticationTokenModel[]

    @AfterLoad()
    async nullChecks () {
      if (!this.verificationTokens) {
        this.verificationTokens = []
      }
      if (!this.authenticationTokens) {
        this.authenticationTokens = []
      }
    }
}

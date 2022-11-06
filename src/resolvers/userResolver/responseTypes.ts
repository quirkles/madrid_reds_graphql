import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class VerifyTokenResponse {
    @Field(() => Boolean)
      wasVerificationSuccessful!: boolean

    @Field(() => String, {
      nullable: true
    })
      jwt?: string

    @Field(() => String, {
      nullable: true
    })
      verificationError?: string
}

import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class VerifyTokenResponse {
  @Field(() => Boolean)
  wasVerificationSuccessful!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  jwt?: string;

  @Field(() => String, {
    nullable: true,
  })
  verificationError?: string;
}

@ObjectType()
export class AuthenticationResponse {
  @Field(() => Boolean)
  wasAuthenticationSuccessful!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  jwt?: string;

  @Field(() => String, {
    nullable: true,
  })
  authenticationError?: string;
}

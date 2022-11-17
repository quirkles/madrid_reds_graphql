import { Field, ObjectType } from "type-graphql";
import { AlternateResponse } from "./baseAlternateResponse";

@ObjectType({
  description:
    "Fallback response when the input cannot be used meaningfully for the query or mutation",
})
export class BadInputResponse extends AlternateResponse {
  constructor(errorReason: string) {
    super("BadInputResponse");
    this.errorReason = errorReason;
  }

  @Field({
    description:
      "A human readable message outlining why the passed input was invalid",
  })
  errorReason!: string;
}

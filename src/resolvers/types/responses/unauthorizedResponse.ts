import { Field, ObjectType } from "type-graphql";
import { AlternateResponse } from "./baseAlternateResponse";

@ObjectType({
  description:
    "Fallback response when the caller does not have sufficient permissions to perform the action",
})
export class UnauthorizedResponse extends AlternateResponse {
  constructor() {
    super("UnauthorizedResponse");
    this.errorReason = "You do not have permissions to perform this action.";
  }

  @Field({
    description: "A human readable message outlining why the call failed",
  })
  errorReason!: string;
}

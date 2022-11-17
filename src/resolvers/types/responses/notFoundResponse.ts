import { Field, ObjectType } from "type-graphql";
import { AlternateResponse } from "./baseAlternateResponse";

@ObjectType({ description: "Fallback response when an entity cannot be found" })
export class NotFoundResponse extends AlternateResponse {
  constructor(entityType: string, lookupParams: string) {
    super("NotFoundResponse");
    this.entityType = entityType;
    this.lookupParams = lookupParams;
  }

  @Field({ description: "The type of entity that was requested" })
  entityType!: string;

  @Field(() => String, {
    description:
      "The stringified find params that failed to return any results",
  })
  lookupParams!: string;
}

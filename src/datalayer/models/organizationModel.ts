import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { DivisionModel } from "./divisionModel";

@Entity({ name: "organization" })
@ObjectType("Organization", {
  description: "Organization that runs seasons of divisions",
})
export class OrganizationModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [DivisionModel])
  @OneToMany(() => DivisionModel, (division) => division.organization)
  divisions!: DivisionModel[];
}

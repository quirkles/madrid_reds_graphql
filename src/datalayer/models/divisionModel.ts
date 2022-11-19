import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { OrganizationModel } from "./organizationModel";
import { SeasonModel } from "./seasonModel";

@Entity({ name: "division" })
@ObjectType("Division", {
  description: "A specific division that is run by an organization",
})
export class DivisionModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  organizationId!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [SeasonModel])
  @OneToMany(() => SeasonModel, (season) => season.division)
  seasons!: SeasonModel[];

  @Field(() => OrganizationModel)
  @ManyToOne(() => OrganizationModel, (org) => org.divisions)
  public organization!: OrganizationModel;
}

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
import { LeagueModel } from "./leagueModel";

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
  name!: string;

  @Field(() => [LeagueModel])
  @OneToMany(() => LeagueModel, (league) => league.division)
  leagues!: LeagueModel[];

  @Field(() => OrganizationModel)
  @ManyToOne(() => OrganizationModel, (org) => org.divisions)
  public organization!: OrganizationModel;
}

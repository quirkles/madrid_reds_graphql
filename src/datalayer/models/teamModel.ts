import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { TeamInSeasonModel } from "./teamInSeasonModel";

@Entity({ name: "team" })
@ObjectType("Team", {})
export class TeamModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [TeamInSeasonModel])
  @OneToMany(() => TeamInSeasonModel, (teamInSeason) => teamInSeason.team)
  seasons!: TeamInSeasonModel[];
}

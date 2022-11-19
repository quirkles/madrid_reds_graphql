import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserModel } from "./userModel";
import { RoleModel } from "./roleModel";
import { GameEventModel } from "./gameEventModel";
import { TeamModel } from "./teamModel";
import { SeasonModel } from "./seasonModel";

@Entity({ name: "player" })
@ObjectType("Player", {
  description: "A player is a user on a team for a given season",
})
export class PlayerModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field(() => String)
  @Column()
  public position!: string;

  @Field(() => ID)
  @Column()
  public userId!: string;

  @Field(() => ID)
  @Column()
  public teamId!: string;

  @Field(() => ID)
  @Column()
  seasonId!: string;

  @Field(() => UserModel)
  @ManyToOne(() => UserModel, (user) => user.seasonsAsPlayer)
  user!: UserModel;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.players)
  team!: TeamModel;

  @Field(() => SeasonModel)
  @ManyToOne(() => SeasonModel, (season) => season.players)
  season!: SeasonModel;

  @Field(() => [RoleModel])
  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.teamPlayersWithRole)
  roles!: RoleModel[];

  @Field(() => [GameEventModel])
  @OneToMany(() => GameEventModel, (event) => event.player)
  gameEvents!: GameEventModel[];
}

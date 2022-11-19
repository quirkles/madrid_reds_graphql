import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  ManyToMany,
  JoinTable, OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { UserModel } from "./userModel";
import { TeamModel } from "./teamModel";
import { RoleModel } from "./roleModel";
import {GameEventModel} from "./gameEventModel";

@Entity({ name: "user_to_team" })
@ObjectType("TeamPlayer", {
  description: "A users appearance on a specific team",
})
export class UserToTeamModel extends BaseEntity {
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

  @Field(() => UserModel)
  @ManyToOne(() => UserModel, (user) => user.userToTeams)
  public user!: UserModel;

  @Field(() => TeamModel)
  @ManyToOne(() => TeamModel, (team) => team.userToTeams)
  public team!: TeamModel;

  @Field(() => [RoleModel])
  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.teamPlayersWithRole)
  roles!: RoleModel[];

  @Field(() => [GameEventModel])
  @OneToMany(() => GameEventModel, (event) => event.player)
  gameEvents!: GameEventModel[];
}

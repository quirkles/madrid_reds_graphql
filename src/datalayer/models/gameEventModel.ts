import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserToTeamModel } from "./userToTeamModel";
import { FixtureModel } from "./fixtureModel";
import { EventTypeModel } from "./eventTypeModel";

@Entity({ name: "game_event" })
@ObjectType("GameEvent", {})
export class GameEventModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  @Column()
  gameTimeOfEvent!: Date;

  @Field(() => String)
  @Column()
  awayTeamId!: string;

  @Field(() => Date)
  @Column()
  date!: Date;

  @ManyToOne(() => FixtureModel, (fixture) => fixture.gameEvents)
  fixture!: FixtureModel;

  @ManyToOne(() => UserToTeamModel, (player) => player.gameEvents)
  player!: UserToTeamModel;

  @ManyToOne(() => EventTypeModel, (eventType) => eventType.gameEvents)
  eventType!: EventTypeModel;

  @Field(() => [GameEventModel])
  @JoinTable()
  @ManyToMany(() => GameEventModel, (event) => event.relatedEvents)
  // eslint-disable-next-line no-use-before-define
  relatedEvents!: GameEventModel[];
}

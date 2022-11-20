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

import { PlayerModel } from "./playerModel";
import { FixtureModel } from "./fixtureModel";
import { EventTypeModel } from "./eventTypeModel";

@Entity({ name: "game_event" })
@ObjectType("GameEvent", {})
export class GameEventModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Column()
  fixtureId!: string;

  @Field(() => String)
  @Column()
  playerId!: string;

  @Field(() => Date)
  @Column()
  gameTimeOfEvent!: Date;

  @ManyToOne(() => FixtureModel, (fixture) => fixture.gameEvents)
  fixture!: FixtureModel;

  @ManyToOne(() => PlayerModel, (player) => player.gameEvents)
  player!: PlayerModel;

  @ManyToOne(() => EventTypeModel, (eventType) => eventType.gameEvents)
  eventType!: EventTypeModel;

  @Field(() => [GameEventModel])
  @JoinTable()
  @ManyToMany(() => GameEventModel, (event) => event.relatedEvents)
  // eslint-disable-next-line no-use-before-define
  relatedEvents!: GameEventModel[];
}

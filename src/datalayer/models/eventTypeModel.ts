import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { GameEventModel } from "./gameEventModel";

export const GameEventType = {
  GOAL: "GOAL",
  ASSIST: "ASSIST",
  YELLOW_CARD: "YELLOW_CARD",
  RED_CARD: "RED_CARD",
} as const;
export type GameEventType = typeof GameEventType[keyof typeof GameEventType];

registerEnumType(GameEventType, {
  name: "GameEventType", // this one is mandatory
  description: "The types of event that can happen in a game", // this one is optional
});

@Entity({ name: "event_type" })
@ObjectType("EventType", {})
export class EventTypeModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Field(() => GameEventType)
  @Column({ nullable: false, unique: true })
  eventType!: string;

  @Field(() => [GameEventModel], { name: "gameEvents" })
  @OneToMany(() => GameEventModel, (event) => event.eventType)
  gameEvents!: GameEventModel[];
}

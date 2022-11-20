import { EventTypeModel, GameEventType } from "../models";

export async function initializeEventTypes(): Promise<EventTypeModel[]> {
  const eventTypes: EventTypeModel[] = [];
  for (const eventType in GameEventType) {
    let gameEvent: EventTypeModel | null = await EventTypeModel.findOneBy({
      eventType,
    });
    if (!gameEvent) {
      gameEvent = await EventTypeModel.create({ eventType }).save();
    }
    eventTypes.push(gameEvent);
  }
  return eventTypes;
}

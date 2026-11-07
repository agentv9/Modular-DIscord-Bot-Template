import type { Client } from "discord.js";
import type { EventListener } from "./Event";

export class EventRegistry {
  constructor(private readonly client: Client) {}

  register(listener: EventListener): void {
    const method = listener.once ? "once" : "on";
    this.client[method](
      listener.event,
      listener.execute as (...args: unknown[]) => void,
    );
  }
}

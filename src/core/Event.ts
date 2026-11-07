import type { ClientEvents } from "discord.js";

export interface EventListener<
  E extends keyof ClientEvents = keyof ClientEvents,
> {
  event: E;
  once?: boolean;
  execute(...args: ClientEvents[E]): void | Promise<void>;
}

// same deal as defineCommand, purely for type inference
export function defineEvent<E extends keyof ClientEvents>(
  listener: EventListener<E>,
): EventListener<E> {
  return listener;
}

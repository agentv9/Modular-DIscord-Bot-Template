import type { BotClient } from "./BotClient";
import type { ModuleRegistry } from "./ModuleRegistry";
import type { CommandRegistry } from "./CommandRegistry";
import type { EventRegistry } from "./EventRegistry";

// gets passed into every lifecycle hook so modules never have to reach into BotClient directly
export interface ModuleContext {
  client: BotClient;
  registry: ModuleRegistry;
  commands: CommandRegistry;
  events: EventRegistry;
}

export interface Module {
  onLoad?(ctx: ModuleContext): void | Promise<void>;
  onEnable?(ctx: ModuleContext): void | Promise<void>;
  onReady?(ctx: ModuleContext): void | Promise<void>;
  onDisable?(ctx: ModuleContext): void | Promise<void>;
  getExports?(): unknown;
}

// implement this alongside Module and TS will check getExports() actually matches the contract
export interface CapabilityProvider<T> {
  getExports(): T;
}

import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { ModuleContext } from "./Types";

export type CommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export interface CommandExecutionPayload {
  interaction: ChatInputCommandInteraction;
  client: ModuleContext["client"];
  ctx: ModuleContext;
}

export interface CommandOptions {
  data: CommandData;
  execute(payload: CommandExecutionPayload): void | Promise<void>;
}

export class Command implements CommandOptions {
  readonly data: CommandData;
  readonly execute: CommandOptions["execute"];

  constructor(command: CommandOptions) {
    this.data = command.data;
    this.execute = command.execute;
  }
}

// just for the type inference, no need for `satisfies` in every module
export function defineCommand(command: CommandOptions): Command {
  return new Command(command);
}

import type { Command } from "./Command";

export class CommandRegistry {
  private readonly commands = new Map<string, Command>();

  register(command: Command): void {
    const name = command.data.name;
    if (this.commands.has(name)) {
      throw new Error(`Duplicate command name "${name}"`);
    }
    this.commands.set(name, command);
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAll(): Command[] {
    return [...this.commands.values()];
  }

  toJSON() {
    return this.getAll().map((command) => command.data.toJSON());
  }
}

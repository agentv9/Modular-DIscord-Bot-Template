import type { CapabilityProvider, Module, ModuleContext } from "#core/Types";
import pingCommand from "./commands/ping.command";
import readyEvent from "./events/ready.event";

export interface ExampleService {
  greet(name: string): string;
}

// swap this for your own module - manifest/module files just need to keep the naming convention
export default class ExampleModule
  implements Module, CapabilityProvider<ExampleService>
{
  async onLoad(ctx: ModuleContext) {
    // do setup here (db connections, etc) - runs before this module's capability is registered
  }

  async onEnable(ctx: ModuleContext) {
    ctx.commands.register(pingCommand);
    ctx.events.register(readyEvent);
  }

  async onReady(ctx: ModuleContext) {
    // fires once the client is connected and every module has finished loading
  }

  getExports(): ExampleService {
    return {
      greet: (name) => `Hello, ${name}!`,
    };
  }
}

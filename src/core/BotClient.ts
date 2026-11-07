import { Client, Events, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { discoverModules, type DiscoveredModule } from "./ModuleLoader";
import { ModuleRegistry } from "./ModuleRegistry";

const CORE_INTENTS: (keyof typeof GatewayIntentBits)[] = ["Guilds"];
const MODULES_DIR = join(__dirname, "..", "modules");

function resolveIntents(discovered: DiscoveredModule[]): GatewayIntentBits[] {
  const names = new Set<keyof typeof GatewayIntentBits>(CORE_INTENTS);
  for (const { manifest } of discovered) {
    for (const intent of manifest.intents ?? []) names.add(intent);
  }
  return [...names].map((name) => GatewayIntentBits[name]);
}

export class BotClient extends Client {
  readonly registry: ModuleRegistry;
  private shutdownPromise?: Promise<void>;
  private moduleLoadPromise?: Promise<void>;

  constructor() {
    const discovered = discoverModules(MODULES_DIR);
    super({ intents: resolveIntents(discovered) });
    this.registry = new ModuleRegistry(this, discovered);
  }

  async start(): Promise<void> {
    this.moduleLoadPromise = this.registry.load();
    await this.moduleLoadPromise;
    if (this.shutdownPromise) return;

    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.registry.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute({
        interaction,
        client: this,
        ctx: this.registry.context,
      });
    });

    this.once(Events.ClientReady, async () => {
      await this.application?.commands.set(this.registry.commands.toJSON());
      await this.registry.ready();
    });

    await this.login(process.env.BOT_TOKEN);
  }

  override destroy(): Promise<void> {
    if (!this.shutdownPromise) {
      this.shutdownPromise = (async () => {
        // Initialization must settle before unloading newly opened resources.
        await this.moduleLoadPromise?.catch(() => undefined);
        // Stop accepting Discord interactions before closing module resources.
        try {
          await super.destroy();
        } finally {
          await this.registry.unload();
        }
      })();
    }
    return this.shutdownPromise;
  }
}

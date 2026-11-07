import type { BotClient } from "./BotClient";
import type { DiscoveredModule } from "./ModuleLoader";
import type { Module, ModuleContext } from "./Types";
import { satisfies } from "./Semver";
import { CommandRegistry } from "./CommandRegistry";
import { EventRegistry } from "./EventRegistry";

interface LoadedModule {
  manifest: DiscoveredModule["manifest"];
  instance: Module;
}

export class ModuleRegistry {
  readonly commands = new CommandRegistry();
  readonly events: EventRegistry;
  readonly context: ModuleContext;

  private readonly capabilityExports = new Map<string, unknown>();
  private readonly loaded: LoadedModule[] = [];

  constructor(
    private readonly client: BotClient,
    private readonly discovered: DiscoveredModule[],
  ) {
    this.events = new EventRegistry(client);
    this.context = {
      client,
      registry: this,
      commands: this.commands,
      events: this.events,
    };
  }

  // runs onLoad -> registers provides -> onEnable, strictly in dependency order
  async load(): Promise<void> {
    try {
      for (const { manifest, ModuleClass } of this.resolveLoadOrder()) {
        const instance = new ModuleClass();
        // Include partial initialization in cleanup if onLoad/onEnable fails.
        this.loaded.push({ manifest, instance });
        await instance.onLoad?.(this.context);

        for (const provided of manifest.provides ?? []) {
          if (this.capabilityExports.has(provided.id)) {
            throw new Error(
              `Duplicate provider for capability "${provided.id}" (module "${manifest.id}")`,
            );
          }
          this.capabilityExports.set(provided.id, instance.getExports?.());
        }

        await instance.onEnable?.(this.context);
      }
    } catch (error) {
      try {
        await this.unload();
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "Module loading and cleanup failed",
        );
      }
      throw error;
    }
  }

  async unload(): Promise<void> {
    const errors: unknown[] = [];
    // Consumers shut down before the providers they depend on.
    for (const { instance } of this.loaded.splice(0).reverse()) {
      try {
        await instance.onDisable?.(this.context);
      } catch (error) {
        errors.push(error);
      }
    }
    this.capabilityExports.clear();
    if (errors.length)
      throw new AggregateError(errors, "Module cleanup failed");
  }

  // call once the client has actually fired its ready event
  async ready(): Promise<void> {
    for (const { instance } of this.loaded) {
      await instance.onReady?.(this.context);
    }
  }

  getCapability<T>(id: string): T {
    if (!this.capabilityExports.has(id)) {
      throw new Error(`No provider registered for capability "${id}"`);
    }
    return this.capabilityExports.get(id) as T;
  }

  tryGetCapability<T>(id: string): T | undefined {
    return this.capabilityExports.get(id) as T | undefined;
  }

  private resolveLoadOrder(): DiscoveredModule[] {
    const byModuleId = new Map(this.discovered.map((d) => [d.manifest.id, d]));
    const providerByCapability = new Map<string, DiscoveredModule>();

    for (const d of this.discovered) {
      for (const provided of d.manifest.provides ?? []) {
        const existing = providerByCapability.get(provided.id);
        if (existing) {
          throw new Error(
            `Capability "${provided.id}" is provided by both "${existing.manifest.id}" and "${d.manifest.id}"`,
          );
        }
        providerByCapability.set(provided.id, d);
      }
    }

    // module -> the modules that must load before it
    const dependsOn = new Map<string, DiscoveredModule[]>();

    for (const d of this.discovered) {
      const deps: DiscoveredModule[] = [];

      for (const ref of d.manifest.dependencies?.modules ?? []) {
        const provider = byModuleId.get(ref.id);
        if (!provider) {
          if (ref.optional) continue;
          throw new Error(
            `Module "${d.manifest.id}" requires module "${ref.id}", but it isn't loaded`,
          );
        }
        if (!satisfies(provider.manifest.version, ref.version)) {
          if (ref.optional) continue;
          throw new Error(
            `Module "${d.manifest.id}" requires "${ref.id}@${ref.version}", but found "${provider.manifest.version}"`,
          );
        }
        deps.push(provider);
      }

      for (const ref of d.manifest.dependencies?.capabilities ?? []) {
        const provider = providerByCapability.get(ref.id);
        if (!provider) {
          if (ref.optional) continue;
          throw new Error(
            `Module "${d.manifest.id}" requires capability "${ref.id}", but no module provides it`,
          );
        }
        const providedVersion = provider.manifest.provides!.find(
          (p) => p.id === ref.id,
        )!.version;
        if (!satisfies(providedVersion, ref.version)) {
          if (ref.optional) continue;
          throw new Error(
            `Module "${d.manifest.id}" requires capability "${ref.id}@${ref.version}", but found "${providedVersion}"`,
          );
        }
        deps.push(provider);
      }

      dependsOn.set(d.manifest.id, deps);
    }

    const sorted: DiscoveredModule[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (d: DiscoveredModule) => {
      if (visited.has(d.manifest.id)) return;
      if (visiting.has(d.manifest.id)) {
        throw new Error(
          `Circular dependency detected involving module "${d.manifest.id}"`,
        );
      }
      visiting.add(d.manifest.id);
      for (const dep of dependsOn.get(d.manifest.id) ?? []) visit(dep);
      visiting.delete(d.manifest.id);
      visited.add(d.manifest.id);
      sorted.push(d);
    };

    for (const d of this.discovered) visit(d);

    return sorted;
  }
}

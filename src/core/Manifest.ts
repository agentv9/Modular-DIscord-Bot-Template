import type { GatewayIntentBits } from "discord.js";

export interface ModuleReference {
  id: string;
  version: string;
  optional?: boolean;
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  intents?: (keyof typeof GatewayIntentBits)[];
  provides?: { id: string; version: string }[];
  dependencies?: {
    modules?: ModuleReference[];
    capabilities?: ModuleReference[];
  };
}

export function defineManifest(manifest: ModuleManifest): ModuleManifest {
  return Object.freeze(manifest);
}

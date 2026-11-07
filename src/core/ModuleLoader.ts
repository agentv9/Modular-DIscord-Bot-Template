import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ModuleManifest } from "./Manifest";
import type { Module } from "./Types";

export interface DiscoveredModule {
  manifest: ModuleManifest;
  ModuleClass: new () => Module;
}

export function discoverModules(modulesDir: string): DiscoveredModule[] {
  const discovered: DiscoveredModule[] = [];

  for (const entry of readdirSync(modulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const moduleDir = join(modulesDir, entry.name);
    const files = readdirSync(moduleDir);

    const manifestFile = files.find((f) => /\.manifest\.[tj]s$/.test(f));
    const moduleFile = files.find((f) => /\.module\.[tj]s$/.test(f));
    if (!manifestFile || !moduleFile) continue;

    const { default: manifest } = require(join(moduleDir, manifestFile));
    const { default: ModuleClass } = require(join(moduleDir, moduleFile));

    discovered.push({ manifest, ModuleClass });
  }

  return discovered;
}

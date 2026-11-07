import { defineManifest } from "#core/Manifest";

export default defineManifest({
  id: "example",
  name: "Example Module",
  version: "1.0.0",
  description: "An example module for the bot template",
  intents: ["Guilds", "GuildMessages"],
  provides: [
    {
      id: "example-capability",
      version: "1.0.0",
    },
  ],
  dependencies: {
    modules: [
      {
        id: "another-module",
        version: "1.0.0",
        optional: true,
      },
    ],
    capabilities: [
      {
        id: "another-capability",
        version: "1.0.0",
        optional: true,
      },
    ],
  },
});

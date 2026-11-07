import { Events } from "discord.js";
import { defineEvent } from "#core/Event";

export default defineEvent({
  event: Events.ClientReady,
  once: true,

  execute(client) {
    console.log(`[example] logged in as ${client.user.tag}`);
  },
});

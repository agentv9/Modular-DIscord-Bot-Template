import { SlashCommandBuilder } from "discord.js";
import { Command } from "#core/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if Atlas is awake."),

  async execute({ interaction, client }) {
    await interaction.reply({
      content: `Pong! ${client.ws.ping}ms`,
      ephemeral: true,
    });
  },
});

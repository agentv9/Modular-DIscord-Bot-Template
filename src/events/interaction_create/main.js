const { Events, Client, Interaction } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
	async execute(client , interaction) {
                if (interaction.isChatInputCommand()) require("./command")(client, interaction);
                if (interaction.isStringSelectMenu()) require("./select_menu")(client, interaction);
                if (interaction.isModalSubmit()) require("./modal")(client, interaction);
        
	},
};    
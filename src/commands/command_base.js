const { SlashCommandBuilder, Client } = require('discord.js');
const { spawn } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Testing command'),
       
		/**
		 * 
		 * @param {import('discord.js').Interaction} interaction 
		 * @param {Client} client 
		 */

	async execute(interaction, client) {

			let thing = await client.translationHandler.getTranslation("test", interaction.user)

			client.reloadCommands("commands")
			client.deployCommands()

           interaction.reply({content: `${thing}`});
		
			},
		  
	
};
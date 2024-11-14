const { SlashCommandBuilder,Interaction,Client, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, UserFlags, PermissionsBitField } = require('discord.js');
const {getCommandNameTranslations, getCommandDescriptionTranslations, getCommandOptionTranslations} = require("../util/handlers/translationHandler")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setNameLocalizations(getCommandNameTranslations("settings"))
		.setDescription('edit your user and server settings')
		.setDescriptionLocalizations(getCommandDescriptionTranslations("settings"))
		.addStringOption(option => 
			option.setName("choice")
			.setNameLocalizations(getCommandOptionTranslations("choice_title"))
			.setDescription('setting option')
			.setDescriptionLocalizations(getCommandOptionTranslations("choice_description"))
			.setRequired(true)
			.addChoices(
				{ name: 'User', value: 'user' },
				{ name: 'Server', value: 'server' }
			)),
		
       /**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
	async execute(interaction, client) {
       
		switch(interaction.options.getString("choice")){

			case "user":

			const embed = new EmbedBuilder()
			.setColor(client.configHandler.get("embed_color"))
			.setTitle(await client.translationHandler.getTranslation("user_settings_title", interaction.user))
			.setDescription(await client.translationHandler.getTranslation("user_settings_description", interaction.user))
			.setTimestamp()  


			const selectMenu = new StringSelectMenuBuilder()
			.setPlaceholder('option')
			.setCustomId("options")
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel("language")
				.setValue("settings_lang"),
				

			)

			const actionRow = new ActionRowBuilder()
			.addComponents(selectMenu)
	
			interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true})
		
			break;

			case "server":
				if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: `${await client.translationHandler.getTranslation("permisison_disallowed", interaction.user)}`})
				
				const configs = client.configHandler.getAll()
				let array = []
		
				for(const config in configs){
				
					array.push(
						new StringSelectMenuOptionBuilder()
						.setLabel(config.toString().split("_").join(" "))
						.setValue(config.toString()),
					)
				} 
				const embed2 = new EmbedBuilder()
				.setColor(client.configHandler.get("embed_color"))
				.setTitle(await client.translationHandler.getTranslation("server_settings_title", interaction.user))
				.setDescription(await client.translationHandler.getTranslation("server_settings_description", interaction.user))
				.setTimestamp()  

				const selectMenu2 = new StringSelectMenuBuilder()
				.setPlaceholder('option')
				.setCustomId("server_option")
				.setMaxValues(1)
				.setMinValues(1)
				.addOptions(
					array
				)
				const actionRow2 = new ActionRowBuilder()
				.addComponents(selectMenu2)
				interaction.reply({embeds:[embed2], components: [actionRow2], ephemeral: true})

			break;
		}

			
          
     
			},
		  
	
};
const {EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,ActionRowBuilder, Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js")
const {readLanguages} = require("../../util/handlers/translationHandler")

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */

module.exports = async (client, interaction) => {

    switch(interaction.values[0])
    {
        case "settings_lang": 
        const embed = new EmbedBuilder()
        .setColor(client.configHandler.get("embed_color"))
        .setTitle(await client.translationHandler.getTranslation("change_language_title", interaction.user))
        .setDescription(await client.translationHandler.getTranslation("change_language_description", interaction.user))
        .setTimestamp()  

        const languages = readLanguages()
        let array = []

        for(const lang of languages){
          
            array.push(
                new StringSelectMenuOptionBuilder()
                .setLabel(lang.name)
                .setValue(lang.code),
            )
        }   
    
        const selectMenu = new StringSelectMenuBuilder()
        .setPlaceholder('language')
        .setCustomId("select_language")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
            array
        )


        const actionRow = new ActionRowBuilder()
        .addComponents(selectMenu)

    // Add inputs to the modal
    
        interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true})
        break;

    
    }

    switch(interaction.customId) {
        case "select_language":
         
            const embed = new EmbedBuilder()
            .setColor(client.configHandler.get("embed_color"))
            .setTitle(await client.translationHandler.getTranslation("language_changed_title", interaction.user))
            .setDescription(await client.translationHandler.getTranslation("language_changed_description", interaction.user))
            .setTimestamp()  

            await client.sql.models.User.update({language: interaction.values[0]},{where: {id: interaction.user.id}})
            interaction.message.delete()
            interaction.reply({embeds:[embed], ephemeral: true})
        break;  

        case "server_option":
         
            if(typeof client.configHandler.get(interaction.values[0]) == "string"){

                const modal = new ModalBuilder()
                .setTitle(`${await client.translationHandler.getTranslation("change_setting_title", interaction.user)}"${interaction.values[0].split("_").join(" ")}"`)
                .setCustomId(`changesettings_${interaction.values[0]}`)
                
                const input = new TextInputBuilder()
                .setStyle(TextInputStyle.Short)
                .setCustomId("input")
                .setPlaceholder(await client.translationHandler.getTranslation("placeholder_value", interaction.user))
                .setLabel(await client.translationHandler.getTranslation("placeholder_value_lable", interaction.user))
                .setRequired(true)
    
                const firstActionRow = new ActionRowBuilder().addComponents(input);
    
                modal.addComponents(firstActionRow)
               
                interaction.showModal(modal)
            }else {
               

                const embed = new EmbedBuilder()
                .setColor(client.configHandler.get("embed_color"))
                .setTitle(`${await client.translationHandler.getTranslation("change_setting_title", interaction.user)}"${interaction.values[0].split("_").join(" ")}"`)
                .setDescription(await client.translationHandler.getTranslation("change_setting_description", interaction.user))
                .setTimestamp() 

                
			const selectMenu = new StringSelectMenuBuilder()
			.setPlaceholder('option')
			.setCustomId("option_" + interaction.values[0])
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel("Enabled")
				.setValue("true"),
				new StringSelectMenuOptionBuilder()
				.setLabel("Disabled")
				.setValue("false"),

			)

			const actionRow = new ActionRowBuilder()
			.addComponents(selectMenu)
            
                interaction.reply({embeds:[embed], components: [actionRow], ephemeral: true})
            }

           

        break;
    }

    switch(interaction.customId.split("_")[0]){
        case "option": 
            let value = false
            let setting = interaction.customId.replace("option_", "")
            if(interaction.values[0] === "true"){
                value = true
            }
          
            await client.configHandler.edit(setting, value)
      
            interaction.reply({content: "Setting edited!", ephemeral: true})
        break;
    }
}
const { Client, Interaction } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = async (client, interaction) => {
    switch(interaction.customId.split("_")[0]){
        case "changesettings":
            client.configHandler.edit(interaction.customId.replace("changesettings_", ""), interaction.fields.getTextInputValue('input'))
            interaction.reply({content: "Setting updated!", ephemeral: true})
        break;
    }
   
    
 
}
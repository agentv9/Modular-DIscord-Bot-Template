const chalk = require("chalk")
module.exports = async (client, interaction) => {
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`${chalk.red("[WARNING]:")} No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(chalk.red("[ERROR]: ") + error );
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}
require("dotenv").config();

const { REST, Routes } = require('discord.js');
const path = require("path")
const fs = require('node:fs');

const chalk = require("chalk")

const commands = [];
function deployCommands(client)  {

function loadCommands(dir) {
	const commandFiles = fs.readdirSync(path.join( dir));
	for (const file of commandFiles) {
		const stat = fs.lstatSync(path.join( dir, file))
		
		if(stat.isDirectory()){
			loadCommands(path.join("commands", file))
		}else {
			const command = require(path.join( dir, file));
			commands.push(command.data.toJSON());
		}
	}
}

loadCommands(path.join(__dirname, "commands"))

for(const dir of client.commanddirs) {
	loadCommands(dir)
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env._TOKEN);
// and deploy your commands!
(async () => {
	try {
		console.log(`${chalk.blue("[Info]: ")}Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env._ID, process.env._TEST_GUID),
			{ body: commands },
		);

		console.log(`${chalk.green("[Info]: ")}Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(chalk.red("[ERROR]: ") +error);
	}
})();
}

module.exports = {deployCommands}
const {sql, configHandler, translationHandler} = require("./util")
const {readLanguages} = require("./util/handlers/translationHandler")
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
require("dotenv").config();
const chalk = require("chalk")
const path = require("path")
const fs = require("fs")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// - Function to create folders if they are missing

function checkFolderExists(path) {
	const exists = fs.existsSync(path);
	if(!exists){
		fs.mkdirSync(path);
		return true;
	}else {
		return true;
	}
}

// - Feature hander

function readFeatures(dir) {
	checkFolderExists(path.join(__dirname, dir))
	const files = fs.readdirSync(path.join(__dirname, dir))
	for(const file of files){
		const stat = fs.lstatSync(path.join(__dirname, dir, file))
		if(stat.isDirectory()){
			readFeatures(path.join("features", file))
		}else if (file !== 'main.js') {
			const feature = require(path.join(__dirname, dir, file))
			console.log(chalk.blueBright("[Feature handler]: ") + `Loaded feature: ${file.split(".js")[0]}`)
			feature(client)
		}
	}
}

readFeatures("features")

// - Module hander

client.modules = []
client.commanddirs = []
client.modeldirs = []
client.eventdirs = []

function readModules(dir) {
	checkFolderExists(path.join(__dirname, dir))
	const files = fs.readdirSync(path.join(__dirname, dir))
	for(const file of files){
		const stat = fs.lstatSync(path.join(__dirname, dir, file))
		if(stat.isDirectory()){
			readModules(path.join(dir, file))
		}else if (file == 'module.js') {
			const moduleclass = require(path.join(__dirname, dir, file))
			const module = new moduleclass(client)
			console.log(chalk.magentaBright("[Module handler]: ") + `Loaded module: ${module.constructor.name}`)
			if(Object.hasOwn(module, "commandsDIR")) {
				client.commanddirs.push(module.commandsDIR)
			}
			if(Object.hasOwn(module, "modelsDIR")) {
				client.modeldirs.push(module.modelsDIR)
			}
			if(Object.hasOwn(module, "eventsDIR")) {
				client.eventdirs.push(module.eventsDIR)
			}
			client.modules.push(module)

			module.Init(client)
			return;
		}
	}

	for(const module of client.modules) {
		module.Main()
		
	}

}

readModules("modules")

// - Events handler

function readEvents(dir) {
	const files = fs.readdirSync(path.join( dir))
	for(const file of files){
		const stat = fs.lstatSync(path.join( dir, file))
		if(stat.isDirectory()){
			readEvents(path.join(dir, file))
		}else if (file == 'main.js') {
			const event = require(path.join( dir, file))
		
			if (event.once) {
				client.once(event.name, (...args) => event.execute(client, ...args));
				console.log(chalk.yellowBright("[Event handler]: ") + `Loaded event: ${event.name}`)
	
			} else {
				client.on(event.name, (...args) => event.execute(client, ...args));
				console.log(chalk.yellowBright("[Event handler]: ") + `Loaded event: ${event.name}`)
	
			}
		}
	}
}



readEvents(path.join(__dirname, "events"))

for(const dir of client.eventdirs) {
	readEvents(dir)
}


// - Command handler

client.cooldowns = new Collection();

client.commands = new Collection();

function readCommands(dir) {
	const commandFiles = fs.readdirSync(dir);
	
	for (const file of commandFiles) {
		const stat = fs.lstatSync(path.join(dir, file))
		
		if(stat.isDirectory()){
			readCommands(path.join("commands", file))
		}else {
			const command = require(path.join(dir, file));
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			console.log(`${chalk.blueBright("[Commands]: ")}Loaded command: ${command.data.name}`)
			client.commands.set(command.data.name, command);
		} else {
			console.log(`${chalk.red("[WARNING]:")}The command at ${filePath} is missing a required "data" or "execute" property.`);
			}	
		}
	}
}
	
readCommands(path.join(__dirname, "commands"))

for(const dir of client.commanddirs) {
	readCommands(dir)
	
}

client.LoadCommands = readCommands

// - Register commands

const {deployCommands} = require("./deploy-commands")

deployCommands(client)

// - Database setup

client.sql = sql(client)

// - Config setup

client.configHandler = new configHandler()

client.configHandler.load()

// - Translations setup

client.translationHandler = new translationHandler(client)

readLanguages()


client.login(process.env._TOKEN);

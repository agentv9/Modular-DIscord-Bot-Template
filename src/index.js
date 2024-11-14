const {sql, configHandler, translationHandler} = require("./util")
const {readLanguages} = require("./util/handlers/translationHandler")
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
require("dotenv").config();
const chalk = require("chalk")
const path = require("path")
const fs = require("fs")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// - Register commands

client.deployCommands = require("./deploy-commands")

// - Database setup

client.sql = sql()

// - Config setup

client.configHandler = new configHandler()

client.configHandler.load()

// - Translations setup

client.translationHandler = new translationHandler(client)

readLanguages()
// - Feature hander

function readFeatures(dir) {
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

function readModules(dir) {
	const files = fs.readdirSync(path.join(__dirname, dir))
	for(const file of files){
		const stat = fs.lstatSync(path.join(__dirname, dir, file))
		if(stat.isDirectory()){
			readModules(path.join(dir, file))
		}else if (file == 'main.js') {
			const feature = require(path.join(__dirname, dir, file))
			console.log(chalk.magentaBright("[Module handler]: ") + `Loaded module: ${feature.name}`)
			client.modules.push(feature.name)
			feature.execute(client)
		}
	}
}

readModules("modules")

// - Events handler

function readEvents(dir) {
	const files = fs.readdirSync(path.join(__dirname, dir))
	for(const file of files){
		const stat = fs.lstatSync(path.join(__dirname, dir, file))
		if(stat.isDirectory()){
			readEvents(path.join("events", file))
		}else if (file == 'main.js') {
			const event = require(path.join(__dirname, dir, file))
		
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

readEvents("events")

// - Command handler

client.cooldowns = new Collection();

client.commands = new Collection();

function readCommands(dir) {
	const commandFiles = fs.readdirSync(path.join(__dirname, dir));
	
	for (const file of commandFiles) {
		const stat = fs.lstatSync(path.join(__dirname, dir, file))
		
		if(stat.isDirectory()){
			readCommands(path.join("commands", file))
		}else {
			const command = require(path.join(__dirname, dir, file));
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
	
readCommands("commands")

client.reloadCommands = readCommands


client.login(process.env._TOKEN);

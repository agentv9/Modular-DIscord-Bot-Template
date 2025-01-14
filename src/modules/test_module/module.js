const path = require("path")
const fs = require("fs")

module.exports = class TestModule{ // The class name is what will be shown in the console when the bot is starting up for the module name
    
    client
    constructor(client) { // The discord.js bot instance is passed to every module
        
        this.client = client
        this.commandsDIR = path.join(__dirname, "commands")
        this.modelsDIR = path.join(__dirname, "models")
        this.eventsDIR = path.join(__dirname, "events")
    }

    async Init() { // This function will run on bot start, it should be used for all your initilization logic
      
    }

    async Main() { // This function will run once the bot has finished loading everything, this should be used for your main module logic
        
    }
}
# Modular discord bot template

### By: Kaseknife95

Thank you for using my bot template!



This template was developed to make creating new bots quick and easy. To aid in this i have built in multiple systems to make customizing the bot as easy as possible.



### Features

- Built in SQL database support. (SQLite, mySQL, PostgreSQL)

- Built in translation support, found in `src/util/translations`.

- Easy to use templates for various bot features. (Commands, Features, Modules, Events)

- Highly customizable config.







 - ## 1 - Commands

    Commands follow a simple and easy to modify template which is structured as follows:

    ```js

    module.exports = {

	    data: new SlashCommandBuilder()

		    .setName('test') // This is the name which will show on discord 
        .setNameLocalizations(commandTranslaitons("test")) // Loads the names of this command for different languages
		    .setDescription('Testing command'), // Command description

        // This is a typical slash command builder, check https://discord.js.org/docs/packages/builders/main/SlashCommandBuilder:Class for more information

	    async execute(interaction, client) {

            // Interaction is a discord.js command interaction, check docs for more info

            // Client is the bots client, i will provide more information farther down this file 

           interaction.reply({content: `test command`})

		},

    };

    ```

- ## 2 - Features

    Features are addons for the bot, typically single .js files which add simple functionality to the bot, they also have a simple template they follow to make developing them a breeze

    ```js

    module.exports = (client) => {



    }

    ```

    As you can tell these are just exporting a function which takes in the client as a parameter, while minimal this is intentional as features are typically intended to extend the client or execute functions already on the client.



- ## 3 - Modules

    Modules add complex functionality to the bot and follow this below template exporting the module class, the below code should be placed within a `main.js` file inside the modules subdirectory located in the `modules` folder.

    Modules are exported classes, each one has 2 main functions aswell as a few optional class variables, the functions are a `Init` function ran while the bot is initalizing and a `Main` function which is ran after all modules are registered and loaded,  the optional Util variables are marked and explained in the code block below.

    ```js
  module.exports = class TestModule{ // The class name is what will be shown in the console when the bot is starting up for the module name
    
      client
      constructor(client) { // The discord.js bot instance is passed to every module
        
        this.client = client

        // Optional Util variables
        this.commandsDIR = path.join(__dirname, "commands") // If your module has commands, you can put the path here and the bot will automatically load them, this parameter is optional if your module has no commands.
      }

      async Init() { // This function will run on bot start, it should be used for all your initilization logic
      
      }

      async Main() { // This function will run once the bot has finished loading everything, this should be used for your main module logic
        
      }
  }
    ```
   


- ## 4 - The config

    While this one is a given for any bot to easily change things such as the bot token ive structured this template to be centered around the config so that as many aspects as possible can be edited by the client either through editing the config.yml file or by using the settings command through discord.



    For modules however there is some extra functionality, the client provides a configHandler which can be accessed as such: `client.configHandler`. This handler provides multiple functions for fetching and editing config data allowing modules to add their own config options to the bots base config file.



    ```js

    client.configHandler.get(key) // Retreives the config entry for the provided key.

    client.configHandler.getAll() // Returns the entire config, .get() should be used instead.

    client.configHandler.edit(key, value) // Edits the config value for the provided key and saves it to file.

    client.configHandler.load() // Loads the config.yml file into memory, only used on bot load as edit will update the config saved in memory.

    client.configHandler.save() // Saves the current config stored in memory to file.

    ```



- ## 5 - Translations

    Translations are built into the bot by default, no need for a extra module.

    Translation keys follow a simple to follow naming scheme, `"commandName_textType" (example "Info_Description1")` for text and just the command name for command name localisation. you can get translations by using the following functions.

    ```js

    client.translationHandler.getTranslation("Info_Description1", user) // This will get the translation from a specified key



    getCommandNameTranslations("info") // This will fetch the alternate command name translations for this command

    

    getCommandDescriptionTranslations("info") // This will fetch the alternate command description translations for this command

    ```

    `getTranslations()` Will fetch the specified translated string using the users prefered language



    `getCommandNameTranslations()` Will fetch the localized versions of the specified command's name from "<span style="color:GoldenRod; font-weight:bold;">command_names.yml</span>".



    `getCommandDescriptionTranslations()` Will fetch the localized versions of the specified command's description from "<span style="color:GoldenRod; font-weight:bold;">command_descriptions.yml</span>"

  

  `getCommandOptionTranslations()` Will fetch the localized versions of the specified  option from "<span style="color:GoldenRod; font-weight:bold;">command_options.yml</span>"





    Note: logs will default to english



    You an also use the `injectTranslations()` function to add in new translations into the translation files from outside sources, mainly modules (this will be done one time upon the first startup of the bot and only again upon updating translations)

- ## 6 - Events

    To make handling the different events the `discord.js` client spllies easier ive built in a event handler, events follow a simular structure to modules with a few differences, that being name will be a discord.js event, aswell as the addition of a `once` parameter which will determine if the event will run only the first time the event is fired or every time.

    ```js

    const { Events } = require('discord.js');



    module.exports = {

	    name: Events.ClientReady,

	    once: true,

	    execute(client) {



	    },

    };

    ```

- ## 7 - Database

    This template includes a database solution out of the box, it ships with a SQLite database but this can be changed to connect to a remote database by changing a few lines in the `.env` file

    ```yml

    DATABASE_DIALECT=sqlite # supports sqlite, postgresql, mysql

      # Below options are not used with SQLite

    DATABASE_NAME= # The database name the bot will be using

    DATABASE_USERNAME= # Username the bot will use when authenticating

    DATABASE_PASSWORD= # The password the bot will use when authenticating

    DATABASE_HOST= # The host ip/uri of the database

    ```

    You can use the functions provided with Sequelize by using the following:

    ```js

    client.sql.models.{model}.{function}

    ```

    youd replace the bracket parts with your model name and function. the database instance can easily be accessed anywhere that the client is provided. So any modules, functions, commands, etc all will have access.


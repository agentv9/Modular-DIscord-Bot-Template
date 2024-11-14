const YAML = require("yaml")
const WYAML = require("write-yaml-file")
const codes = require("../json/translation_codes.json")
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

module.exports = class translationHandler {

    constructor(client) {
        this.client = client
    }

    /**
     * 
     * @param {String} key The translation key to fetch 
     * @param {import("discord.js").User} user The user who we will fetch their prefered language from
     */
    async getTranslation(key, user){
 
        let data = await this.client.sql.models.User.findOne({
            where: {
                id: user.id
            }
        })

         if(data){
            let translations = this.#loadTranslations(data.language)
            return translations[key]
         }else {
            //create user if doesnt exist already
            let user2 = await this.client.sql.models.User.create({id: user.id, language: "en"})
            await user2.save()

            let translations = this.#loadTranslations("en")
            return translations[key]
         }
    
    }   

    /**
     * @param {String} language the language to inject translations into
     * @param {Object} translations the translations object
     */
    async injectTranslations(language, translations){
        //Fetches the currently stored translations
        let translations2 = this.#loadTranslations(language)

        //loops through provided translations and adds them to the existing translations
        for(translation in translations) {
            translations2[translation] = translations[translation]
        }

        //Saves the translations with the newly injected ones
        this.save(language, translations2)
    }

    /**
    * Saves the currently cached config to the yml file
    */
   save(language, translations){
    const configPath = path.join(__dirname, "../translations", `${language.toLowerCase()}.yml`)
        WYAML(configPath, translations)
   }
    /**
     * 
     * @param {String} lan Language for which to load the translation file
     */
    #loadTranslations(lan) {

        try {
            // Try to load the users specified language file
            let file = fs.readFileSync(path.join(__dirname, "../translations", `${lan.toLowerCase()}.yml`), "utf-8")
            let translations = YAML.parse(file)
            return translations
        }catch {
            console.log(chalk.yellow("[Translations]: ") + `Falling back to english, unable to locate translations for: ${lan.toLowerCase()}.`)
            // Fallback to english if their language isnt valid 
            let file = fs.readFileSync(path.join(__dirname, "../translations", `en.yml`), "utf-8")
            let translations = YAML.parse(file)
            return translations
        }
    }

    
}

/**
     * @param {String} command Command name
     */
module.exports.getCommandNameTranslations = (command) => {
    try {
        // Try to load the users specified language file
        let file = fs.readFileSync(path.join(__dirname, "../translations", `command_names.yml`), "utf-8")
        let translations = YAML.parse(file)
        return translations[command]
    }catch {
        console.log(chalk.yellow("[Translations]: ") + `Cannot locate "command_names.yml" file.`)
        return {}
        // Fallback to english if their language isnt valid 
    }
}

/**
     * @param {String} command Command name
     */
module.exports.getCommandDescriptionTranslations = (command) => {
    try {
        // Try to load the users specified language file
        let file = fs.readFileSync(path.join(__dirname, "../translations", `command_descriptions.yml`), "utf-8")
        let translations = YAML.parse(file)
        return translations[command]
    }catch {
        console.log(chalk.yellow("[Translations]: ") + `Cannot locate "command_descriptions.yml" file.`)
        return {}
        // Fallback to english if their language isnt valid 
    }
}

/**
     * @param {String} option option name
     */
module.exports.getCommandOptionTranslations = (option) => {
    try {
        // Try to load the users specified language file
        let file = fs.readFileSync(path.join(__dirname, "../translations", `command_options.yml`), "utf-8")
        let translations = YAML.parse(file)
        return translations[option]
    }catch {
        console.log(chalk.yellow("[Translations]: ") + `Cannot locate "command_options.yml" file.`)
        return {}
        // Fallback to english if their language isnt valid 
    }
}

module.exports.readLanguages = () => {
	const files = fs.readdirSync(path.join(__dirname, "../translations"))
    let array = []
	for(const file of files){
	
		if (file !== 'command_options.yml' && file !== 'command_names.yml'&& file !== 'command_descriptions.yml') {
			
            array.push({code: file.split(".")[0], name: codes[file.split(".")[0]]})
			
		}
	}
    return array
 
}
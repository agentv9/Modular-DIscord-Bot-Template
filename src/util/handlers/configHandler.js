const YAML = require("yaml")
const WYAML = require("write-yaml-file")
const fs = require("fs")
const path = require("path")

module.exports = class configHandler {
    #config
    
    constructor() {
        this.#config = {}
    }

    /**
     * Loads the bot config into cache
     */
   load() {
    const config = fs.readFileSync(path.join(__dirname, "../../config/config.yml"), "utf-8")
    let readConfig = YAML.parse(config)
    this.#config = readConfig

   }

   /**
    * Saves the currently cached config to the yml file
    */
   save(){
    const configPath = path.join(__dirname, "../../config/config.yml")
        WYAML(configPath, this.#config)
   }


   /**
    * 
    * @param {String} item The item to edit
    * @param {String} value The new value
    */
   edit(item, value){
    this.#config[item] = value
    this.save()
   }

   /**
    * 
    * @param {String} item The item to return from the config
    * @returns The config item
    */
   get(item) {
    return this.#config[item]
   }

   /**
    * 
    * @returns The bot config
    */
   getAll(){
    return this.#config
   }

}
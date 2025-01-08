const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config()
const chalk = require("chalk");
const fs = require("fs")
const path = require("path")


module.exports = (client) => {
  let sequelize
    if(process.env.DATABASE_DIALECT === 'sqlite'){
       sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
    }else {
      sequelize = new Sequelize({
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        logging: false
    });
    }
 

      ( async () => {
        try {
           await sequelize.authenticate();
          console.log(chalk.blueBright("[Database]: ") + 'Connection has been established successfully.');
        } catch (error) {
         console.error(chalk.redBright("[Database]: ") + 'Unable to connect to the database:', error);
        }
      })()
    

     
      function readModels(dir) {
        const files = fs.readdirSync(path.join( dir))
        for(const file of files){
          const stat = fs.lstatSync(path.join( dir, file))
          if(stat.isDirectory()){
            readModels(path.join("models", file))
          }else  {
            const model = require(path.join( dir, file))
            console.log(chalk.greenBright("[Database]: ") + `Loaded model: ${file.split(".js")[0]}`)
            model(sequelize, DataTypes)
          }
        }
      }
      
      readModels(path.join(__dirname, "models"));

      for(const dir of client.modeldirs) {
        readModels(dir)
      }

      (async () => {
        await sequelize.sync();
      })()

  
     return sequelize
}


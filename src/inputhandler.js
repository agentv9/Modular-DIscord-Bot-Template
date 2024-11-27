import { select, input, password } from "@inquirer/prompts";
import {select as selectplus} from "inquirer-select-pro"
import chalk from "chalk";


export default async () => {
let data = {}
    data.package_manager= await select({
        message: 'Select a package manager',
        choices: [
          {
            name: 'npm',
            value: 'npm',
            description: 'use npm to manage the bots packages',
          },
          {
            name: 'yarn',
            value: 'yarn',
            description: 'use yarn to manage the bots packages',
          },
        ]
    })
    console.log(chalk.cyan("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"))
    data.database_type = await select({
        message: 'Select a database type',
        choices: [
          {
            name: 'SQLite',
            value: 'sqlite',
            description: 'use a local sqlite database',
          },
          {
            name: 'mySQL',
            value: 'mysql',
            description: 'use a remote mysql database',
          },
          {
            name: "PostgreSQL",
            value: 'postgresql',
            description: 'use a remote postgresql database',
          }
        ]
    })
    console.log(chalk.cyan("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"))
    if(data.database_type !== "sqlite") {
      data.database_details= {
        DATABASE_NAME: await input({ message: 'Your database name' }),
        DATABASE_USERNAME: await input({ message: 'Your database username' }),
        DATABASE_PASSWORD: await password({message: "Your database password", mask: true}),
        DATABASE_HOST: await input({ message: 'Your database host' }),
    }
    console.log(chalk.cyan("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"))
    }

    data.modules= await selectplus({
        message: 'What modules would you like installed?',
       
        options: [
          { name: 'Moderation', value: 'moderation' },
          { name: 'Fun', value: 'fun' },
          { name: 'Management', value: 'management' },
          { name: 'Anti-Raid', value: 'antiraid' },
        ],
    })
    console.log(chalk.cyan("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"))
    return data
}
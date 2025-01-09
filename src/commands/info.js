const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const os = require("os");
const {getCommandNameTranslations,getCommandDescriptionTranslations, getCommandOptionTranslations} = require("../util/handlers/translationHandler")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setNameLocalizations(getCommandNameTranslations("info"))
    .setDescription("view various client information")
    .setDescriptionLocalizations(getCommandDescriptionTranslations("info"))
    .addSubcommand(subcommand => 
        subcommand.setName("stats")
        .setNameLocalizations(getCommandOptionTranslations("stats_title"))
        .setDescription("View client stats"))
        .setDescriptionLocalizations(getCommandOptionTranslations("stats_description"))
    ,
      /**
     * 
     * @param {CommandInteraction} interaction 
    
     */
    async execute(interaction, client) {

        switch(interaction.options.getSubcommand())
        {
            case "stats":
              interaction.reply({ content: 'Please wait...', fetchReply: true }).then(async (sentmessage) => {
            
   // with initial value to avoid when the array is empty
              const core = os.cpus()[0];
              let days = Math.floor(client.uptime / 86400000);
              let hours = Math.floor(client.uptime / 3600000) % 24;
              let minutes = Math.floor(client.uptime / 60000) % 60;
              let seconds = Math.floor(client.uptime / 1000) % 60;
              const { guild } = interaction

              function add(accumulator, a) {
                return accumulator + a;
              }
 

              let numberMembers = await client.shard.broadcastEval(client =>  client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))

                numberMembers = numberMembers.reduce(add, 0);
                const ping = sentmessage.createdTimestamp - interaction.createdTimestamp
                const Embed420 = new EmbedBuilder()   
                .setColor(client.configHandler.get("embed_color"))
                .setTitle(`client info`)
                .addFields([
                  {
                      name: `Misc`,
                      value: `
                      Node.js: ${process.version}
                      Discord.js: ^14.6.0
                    `,
                      inline: false
                  },
                  {
                    name:"Loaded modules",
                    value: `${client.modules.length > 0 ? client.modules.join(", ") : "none"}`,
                    inline: false
                  }
                ])
                .setDescription(`\`\`\`fix
-               General                   -
-_________________________________________-\`\`\`` +  `\`\`\`yml
client shard: ${guild.shardId + 1} / ${client.shard.count}
client ping: ${ping}ms
API ping: ${client.ws.ping}ms
Total users: ${numberMembers}
\`\`\`` + `\`\`\`fix
+                 System                  +
+_________________________________________+\`\`\`` + `\`\`\`yml
Platform: ${process.platform}
OS Version: ${os.version() + " " + os.release()}
Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
CPU:
\u3000 Cores: ${os.cpus().length}
\u3000 Model: ${core.model}
\u3000 Speed: ${core.speed}MHz
Memory:
\u3000 Total: ${(process.memoryUsage().heapTotal  / 1024 / 1024).toFixed(2)} MB 
\u3000 Used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB \`\`\``)
                
                  .setTimestamp()   
                  interaction.editReply({content: " ", embeds: [Embed420]})
             
                })
            break;
        }
    }
}
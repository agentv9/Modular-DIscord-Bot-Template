module.exports = async (bot) => {
    var state = 0 

    //loop to set bot activity
    setInterval(async() =>{
        let numberServers = await bot.shard.broadcastEval(bot => bot.guilds.cache.size)
        let numberMembers = await bot.shard.broadcastEval(bot =>  bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
        // the different presences for the bot
        const presences = [

            {type: 3, message: `${numberMembers} Members!`},
        //  {type: 3, message: `${bot.shard.count} Shards!`},
        //  {type: 3, message: `${numberServers} Servers!`}
        ]
        state = (state + 1) % presences.length
        var presence = presences[state]
        bot.user.setActivity(`${presence.message}`, {type: presence.type})
    }, 30000)
}
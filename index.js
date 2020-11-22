const settings = require('./settings.json')
const Discord = require("discord.js-light");
const client = new Discord.Client({
    cacheGuilds: false,
    cacheChannels: false,
    cacheOverwrites: false,
    cacheRoles: true,
    cacheEmojis: false,
    cachePresences: false,
})

function ghostPingRevenge(msg) {
    if (msg.mentions.users) {
        if (msg.channel) {
            msg.channel.send(`${msg.author} just ghost pinged `)
                .then(m => m.edit(`${msg.author.tag} just ghost pinged ${msg.mentions.users}!`))
                .catch(e => console.log(e))
                .then(setTimeout(function () {
                    msg.channel.send(msg.author)
                        .then(botmsg => botmsg.delete())
                        .catch(e => console.log(e))
                }, 30000))
                .catch(e => console.log(e))
        }
        if (settings.ban) {
            msg.member.ban({
                days: settings.banlength ? settings.banlength : 9999,
                reason: settings.punishmentReason ? settings.punishmentReason : `Ghostpinged ${msg.mentions.users.first().tag}`
            })
        }
        if (settings.kick) {
            msg.member.kick({
                reason: settings.punishmentReason ? settings.punishmentReason : `Ghostpinged ${msg.mentions.users.first().tag}`
            })
        }
        if (settings.mute) {
            if (!msg.guild.roles.cache.get(settings.muteRole)) {
                return console.log("Mute role could not be found or does not exist.");
            }
            msg.member.roles.add(settings.muteRole, {
                reason: settings.punishmentReason ? settings.punishmentReason : `Ghostpinged ${msg.mentions.users.first().tag}`
            })
        }
        if (settings.log) {
            if (msg.guild.channels.cache.get(settings.logChannel)) {
                msg.guild.channels.cache.get(settings.logChannel).send(`${msg.author} (${msg.author.tag}) ghost pinged ${msg.mentions.users.first()} (${msg.mentions.users.first().tag})`)
            }
        }
    }
}


client.on("messageDelete", msg => {
    ghostPingRevenge(msg)
})
client.on("messageDeleteBulk", msgs => {
    for (i in msgs) {
        ghostPingRevenge(i)
    }
})
client.on("messageUpdate", (oldMessage, newMessage) => {
    ghostPingRevenge(oldMessage)
})
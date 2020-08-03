module.exports.command = {
    name: "delete-profile",
    aliases: ["dprofile"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/delete-profile",
        video: ""
    },
    description: "Deletes __YOUR__ profile from the PokeCloud database. Once a profile is deleted, it can not be recovered.",
    usage: "",
    example: "",
    permissions: {
        role: "any",
        channel: "any"
    },
}

const Discord = require("discord.js")
const utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => {

    let serverid = message.guild.id
    let userid = message.author.id
    let profile = bot.trainerProfile
    let guildSettings = bot.guildSettings

    let user = message.mentions.users.first() || message.author
    let nickname = message.guild.member(user).displayName

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    if(profile.has(userid)) {
        profile.delete(userid)
        message.reply(`Your profile and all data associated with it has been deleted from the PokeCloud servers.`)
        var profile_created = new Discord.RichEmbed()
            .setTitle(`Profile Deleted`)
            .setColor(utilities.colors.error)
            .setDescription(`User: ${nickname}\nDiscord ID: ${userid}\nServer ID: ${serverid}`)
        bot.channels.get(utilities.channels.profile_log).send({embed: profile_created})
    } else {
        message.channel.send(`No profile found...`)
    };
};
const Discord = require("discord.js")
const color = require("../../home/colors.json")

const utilities = require("../../home/utilities.json")

exports.run = (bot, message) => {
    let language = bot.guildSettings.get(message.guild.id, "server.language")
    const respon = require("../" + language.toLowerCase() + "/responses.json")

    var embed = new Discord.RichEmbed()
        .setAuthor(respon.titles.error)
        .setColor(utilities.colors.error)
        .setDescription(respon.errors.must_be_patreon)
    return message.channel.send({embed: embed})
};
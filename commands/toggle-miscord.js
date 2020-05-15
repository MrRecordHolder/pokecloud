module.exports.command = {
    name: "toggle-miscord",
    aliases: ["tmiscord"],
    category: "3rd Party",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/toggle-miscord",
        video: ""
    },
    description: "If true, PokeCloud will display command responses differently to best fit Facebook Messenger. If false, PokeCloud will display command responses best fit for Discord.",
    usage: "",
    example: "",
    permissions: {
        role: "admin",
        channel: "admin"
    },
}

const Discord = require("discord.js")
const color = require("../home/colors.json")

exports.run = async (bot, message) => {

    let serverid = message.guild.id

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    // check channel
    const adminchannel = bot.guildSettings.get(serverid, 'channels.admin')
    if(message.channel.id !== adminchannel) {
        let adminChannelCheck = require(`../home/embeds/adminChannelCheck`);
        return adminChannelCheck.run(bot, message);
    };

    // check role
    let adminrole = bot.guildSettings.get(serverid, 'roles.admin')
    if (!message.member.roles.some(r => r.id === adminrole)) {
        let adminRoleCheck = require(`../home/embeds/adminRoleCheck`);
        return adminRoleCheck.run(bot, message);
    };


    if(!bot.guildSettings.has(serverid, 'bots.miscord')) {
        bot.guildSettings.set(serverid, false, "bots.miscord")
    } 

    var miscord = bot.guildSettings.get(serverid, "bots.miscord")

    miscord = !miscord

    bot.guildSettings.set(serverid, miscord, "bots.miscord")
    
    // send confirmation
    var embed = new Discord.RichEmbed()
        .setAuthor(respon.titles.success)
        .setColor(color.success)
        .setTitle(`${respon.confirm.miscord} **${miscord}**`)
    message.channel.send({embed});
};
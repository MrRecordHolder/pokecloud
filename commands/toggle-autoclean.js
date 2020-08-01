module.exports.command = {
    name: "toggle-autoclean",
    aliases: ["tautoclean"],
    category: "Server settings",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/toggle-autoclean",
        video: ""
    },
    description: "If true, PokeCloud will auto delete some commands and responses on a timed interval.",
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


    if(!bot.guildSettings.has(serverid, 'autoclean')) {
        bot.guildSettings.set(serverid, false, "autoclean")
    } 

    var autoclean = bot.guildSettings.get(serverid, "autoclean")

    autoclean = !autoclean

    bot.guildSettings.set(serverid, autoclean, "autoclean")
    
    // send confirmation
    var embed = new Discord.RichEmbed()
        .setAuthor(respon.titles.success)
        .setColor(color.success)
        .setTitle(`${respon.confirm.autoclean} **${autoclean}**`)
    message.channel.send({embed});
};
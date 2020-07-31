module.exports.command = {
    name: "profile",
    aliases: ["profile"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/profile",
        video: ""
    },
    description: "",
    usage: "",
    example: "",
    permissions: {
        role: "any",
        channel: "any"
    },
};

const Discord = require("discord.js")
const utilities = require(`../home/utilities.json`)



exports.run = (bot, message, args) => {

    let serverid = message.guild.id
    let userid = message.author.id
    let profile = bot.trainerProfile
    let guildSettings = bot.guildSettings

    let user = message.mentions.users.first() || message.author
    let nickname = message.guild.member(user).displayName


    // must be developer
    if (message.author.id !== "373660480532643861") {
        var developer = new Discord.RichEmbed()
            .setColor(utilities.colors.error)
            .setTitle("Only the developer can use this command")    
        return message.channel.send({embed: developer})
        .then(deleteIT => {
            deleteIT.delete(2000)
        });
    };

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    const trainerProfile = require("../keys/trainerProfile")

    // create profile using trainerProfile key
    profile.ensure(userid, trainerProfile);

    // auto-update nickname
    profile.set(userid, nickname, 'trainer.name')

    // auto-update patreon
    if(bot.guilds.get(utilities.server_id).members.get(userid).roles.some(role => role.id === utilities.roles.patreon)) {
        profile.set(userid, true, 'patreon')
    };

    // get profile data
    let farming = profile.get(userid, 'farm')
    let friend_code = profile.get(userid, 'trainer.code')
    let patreon = profile.get(userid, 'patreon')
    let points = profile.get(userid, 'stats.total_points')
    let level = profile.get(userid, 'stats.level')

    const embed = new Discord.RichEmbed()
    embed.setColor("RANDOM")
    embed.setThumbnail(user.avatarURL) 

    // patreon display
    if(patreon === true) {
        embed.setAuthor(`Patreon Donor!`, `https://decentered.co.uk/wp-content/uploads/2019/12/patreon-logo-png-badge-7.png`)
    };   

    embed.setTitle(`**${nickname}** *(${user.presence.status})*`) 
    

    // display trainer code
    if(friend_code !== "") {
        embed.addField(`**Trainer Code**`, friend_code)
    } else {
        embed.addField(`**Trainer Code**`, `Not Set`)
    }

    // display roles
    embed.addField(`**Current Server Roles**`, message.guild.member(user).roles.map(r => r).join(" , "))
    
    message.channel.send(embed);

      
};
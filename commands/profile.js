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

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    const trainerProfile = require("../keys/trainerProfile")

    ///// LOG NEW USER
    if(!profile.has(userid)) {
        var profile_created = new Discord.RichEmbed()
            .setTitle(`Profile Created`)
            .setColor(utilities.colors.success)
            .setDescription(`User: ${nickname}\nDiscord ID: ${userid}\nServer ID: ${serverid}`)
        bot.channels.get(utilities.channels.profile_log).send({embed: profile_created})
    };

    // create profile using trainerProfile key
    profile.ensure(userid, trainerProfile);  
    

    // get profile data
    let farming = profile.get(userid, 'farm')
    let friend_code = profile.get(userid, 'trainer.code')
    let patreon = profile.get(userid, 'patreon')
    let points = profile.get(userid, 'stats.total_points')
    let level = profile.get(userid, 'stats.level')
    let nest_reports = profile.get(userid, 'stats.nest_reports')
    let trainer_name = profile.get(userid, 'trainer.name')
    let home_server = profile.get(userid, 'discord.serverid')


    // set home server
    if(home_server === "") {
        profile.set(userid, serverid, 'discord.serverid')
    };


    // get emojis
    let level_emoji = bot.emojis.get(utilities.emojis.level)
    let points_emoji = bot.emojis.get(utilities.emojis.points)
    let reports_emoji = bot.emojis.get(utilities.emojis.reports)

    const embed = new Discord.RichEmbed()
    embed.setColor("RANDOM")
    embed.setThumbnail(user.avatarURL) 

    // patreon display
    if(patreon === true) {
        embed.setAuthor(`Patreon Donor!`, `https://decentered.co.uk/wp-content/uploads/2019/12/patreon-logo-png-badge-7.png`)
    };   

    if(trainer_name !== "") {
        embed.setTitle(`**${trainer_name}** *(${user.presence.status})*`) 
    } else {
        embed.setTitle(`**${nickname}** *(${user.presence.status})*`) 
    }

    embed.setDescription(`${level_emoji}Level: ${level} | ${points_emoji}Points: ${points}`)

    embed.addField(`**Nest Stats**`, `Reports: ${nest_reports}`)

    // display trainer code
    if(friend_code !== "") {
        embed.addField(`**Trainer Code**`, `||${friend_code}||`)
    } else {
        embed.addField(`**Trainer Code**`, `Not Set`)
    };

    // display roles
    embed.addField(`**Current Server Roles**`, message.guild.member(user).roles.map(r => r).join(" , "))
    
    message.channel.send(embed);      
};
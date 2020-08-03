module.exports.command = {
    name: "set-trainer-name",
    aliases: ["stn"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/set-trainer-name",
        video: ""
    },
    description: "Sets your in-game Trainer name to display on your Profile.",
    usage: "<in_game_name>",
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

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    let trainerName = args.join(" ").trim()

    if(profile.has(userid)) {
        profile.set(userid, trainerName, 'trainer.name')
        message.reply(`Your Trainer name has been updated to **${trainerName}**.`)
    } else {
        message.reply(`You need to create your profile before setting your Trainer name. Reply back with **$profile** to create one now!`)
    };

};
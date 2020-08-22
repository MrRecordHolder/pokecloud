module.exports.command = {
    name: "mycode",
    aliases: ["mc"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/code",
        video: ""
    },
    description: "Displays your Trainer code for others to copy and paste.",
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

    let trainer_code = profile.get(userid, 'trainer.code')
    let trainer_name = profile.get(userid, 'trainer.name')

    if(!profile.has(userid)) {
        return message.reply(`You need to create your profile before setting your Trainer name. Reply back with **$profile** to create one now!`).then(msg => {
            message.delete(utilities.intervals.responses)
            msg.delete(utilities.intervals.thirty_sec)
        });
    };

    if(trainer_code !== "") {

        if(trainer_name !== "") {
            message.channel.send(trainer_name).then(msg => {
                message.delete(utilities.intervals.responses)
                msg.delete(utilities.intervals.two_minutes)
            });
        } else {
            message.channel.send(nickname).then(msg => {
                message.delete(utilities.intervals.responses)
                msg.delete(utilities.intervals.two_minutes)
            });
        };

        message.channel.send(`${trainer_code}`).then(msg => {
            message.delete(utilities.intervals.responses)
            msg.delete(utilities.intervals.two_minutes)
        });
    } else {
        message.reply(`You have not set your Trainer code yet. Do so by using the **$set-mycode** command.`).then(msg => {
            message.delete(utilities.intervals.responses)
            msg.delete(utilities.intervals.thirty_sec)
        });
    }

};
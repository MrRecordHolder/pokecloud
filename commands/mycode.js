module.exports.command = {
    name: "mycode",
    aliases: ["code"],
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

    let trainer_code = profile.get(userid, 'trainer.code')

    if(trainer_code !== "") {
        message.channel.send(`${trainer_code}`);
    } else {
        message.reply(`You have not set your Trainer code yet. Do so by using the **$set-mycode** command.`)
    }

};
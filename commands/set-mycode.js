module.exports.command = {
    name: "set-mycode",
    aliases: ["setcode"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/set-trainer-code",
        video: ""
    },
    description: "Sets your Pokemon GO Trainer code to your profile allowing you to quickly share it with others. This information is private. No Trainers from other servers can access this. Only when you share it.",
    usage: "<trainer code>",
    example: "1111 2222 2222",
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

    

    let the_code = args.join("").trim();

        if(isNaN(the_code[0] && the_code[1] && the_code[2])) {
            return message.reply(`**ERROR:** You only need the code itself. Select the "Copy My Trainer Code" button from the *"Add Friend"* screen of Pokemon GO then re-run this command.`)
        };



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

    if(profile.has(userid)) {
        profile.set(userid, the_code, 'trainer.code')
        message.reply(`Your Trainer code has been updated to **${the_code}**. To share your code, type **$mycode** in any channel. Others Trainers can then quickly copy & paste it into their game.`)
    } else {
        message.reply(`You need to create your profile before setting your Trainer code. Reply back with **$profile** to create one now!`)
    };

};
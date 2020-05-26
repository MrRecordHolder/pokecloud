module.exports.command = {
    name: "set-timezone",
    aliases: ["stz"],
    category: "Server Settings",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/",
        video: ""
    },
    description: "Determines the time output for the current server. Requires the UTC offset number to set/update. This can be ran at anytime to update according to daylight savings time.",
    usage: "<timezone>",
    example: "-4",
    permissions: {
        role: "admin",
        channel: "admin"
    },
    
};

const Discord = require("discord.js")
const color = require("../home/colors.json")

exports.run = async (bot, message, args) => { 

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

    if(args.length > 0 || args == "0") {
        var user_timezone = args.join(" ")
    } else {
        let Prefix = bot.guildSettings.get(serverid, "server.prefix")
        const embed = new Discord.RichEmbed()
            .setColor(color.error)
            .setAuthor(respon.titles.error)
            .setDescription(`You must provide the UTC offset number and the + or - if the number is gerater or less than 0.`)
            .addField(respon.titles.example, Prefix + this.command.aliases + " " + this.command.example)
        message.channel.send(embed);
        return;
    }



    if(user_timezone === "0") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    }
    else if(user_timezone === "+1") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+2") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+3") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+4") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+5") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+6") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+7") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+8") {
        bot.guildSettings.set(serverid, user_timezone, "server.timezone")
    } 
    else if(user_timezone === "+9") {
        bot.guildSettings.set(serverid, "9", "server.timezone")
    } 
    else if(user_timezone === "+10") {
        bot.guildSettings.set(serverid, "10", "server.timezone")
    } 
    else if(user_timezone === "+11") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "+12") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "-1") {
        bot.guildSettings.set(serverid, "-1", "server.timezone")
    } 
    else if(user_timezone === "-2") {
        bot.guildSettings.set(serverid, "-2", "server.timezone")
    } 
    else if(user_timezone === "-3") {
        bot.guildSettings.set(serverid, "-3", "server.timezone")
    } 
    else if(user_timezone === "-4") {
        bot.guildSettings.set(serverid, "-4", "server.timezone")
    } 
    else if(user_timezone === "-5") {
        bot.guildSettings.set(serverid, "-5", "server.timezone")
    } 
    else if(user_timezone === "-6") {
        bot.guildSettings.set(serverid, "-6", "server.timezone")
    } 
    else if(user_timezone === "-7") {
        bot.guildSettings.set(serverid, "-7", "server.timezone")
    } 
    else if(user_timezone === "-8") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "-9") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "-10") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "-11") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } 
    else if(user_timezone === "-12") {
        bot.guildSettings.set(serverid, output, "server.timezone")
    } else {
        // timezone does not exist
        console.log("No timezone found")
        return;
    }

    var timezone = bot.guildSettings.get(serverid, 'server.timezone')

    const today = new Date();

    if(timezone.startsWith('+')) {
        var today_local = new Date(today.toLocaleString("en-US", {timeZone: `Etc/GMT${timezone.replace("+","-")}`}));
    }
    else if(timezone.startsWith('-')) {
        var today_local = new Date(today.toLocaleString("en-US", {timeZone: `Etc/GMT${timezone.replace("-","+")}`}));
    } 
    else if(timezone.startsWith('0')) {
        var today_local = new Date(today.toLocaleString("en-US", {timeZone: `GMT`}));
    }
    else {
        console.log("Must provide a 0, + or a - number.")
        return;
    }

    // format date
    let hours = (today_local.getHours());

    if(hours==0){
        hours=12;
    }
    else if(hours>12) {
        hours=hours%12;
    }

    let minutes = today_local.getMinutes();
    let ampm = today_local.getHours() > 11 ? "PM":"AM";
    let addzero = minutes < 9 ? "0":""
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let formatted_date = days[today_local.getDay()] + " " + months[today_local.getMonth()] + ", " + today_local.getDate() + " at " + hours + ":" + addzero + today_local.getMinutes() + " " + ampm

    const embed = new Discord.RichEmbed()
        .setColor(color.success)
        .setAuthor(respon.titles.success)
        .setDescription(`The UTC timezone offset has been set to **${user_timezone}**`)
        .addField("Current Time", formatted_date)
    message.channel.send(embed);

};
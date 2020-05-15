module.exports.command = {
    name: "nests",
    aliases: ["n"],
    category: "Tools",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/create-nest",
        video: ""
    },
    description: "Quickly search nests, get directions, and find out what species are nesting where with-in your community. Use a sub command to filter results.",
    subcommands: "`reported` or `r`",
    usage: "[subcommand]",
    example: "r",
    permissions: {
        role: "any",
        channel: "any"
    },
}

const Discord = require("discord.js")

exports.run = (bot, message, args) => {

    let serverid = message.guild.id

    let output = args.join(" ").trim().split(",")

    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    let subcommand = capitalize_Words(output[0])
    
    // require guildSettings
    const servername = bot.guildSettings.get(message.guild.id, 'server.name')

    // filter through nests for only current server
    let responseObject = bot.defaultNest.filter(s => s.serverid === message.guild.id)

    
    // start building embed
    var embed = new Discord.RichEmbed()
    embed.setColor("RANDOM")

    if(!subcommand) {
        embed.setTitle(`**${servername} Nests**`)

        if(bot.guildSettings.has(serverid, 'bots.miscord')) {
            var miscord = bot.guildSettings.get(serverid, "bots.miscord")
            if(miscord === true) {
                var NestNames = responseObject.map(key => [`🗺️ **${key.name.default}** - ${key.pokemon.current.name}`])
            } 
            
            else {
                var NestNames = responseObject.map(key => [`[🗺️](${key.location.maps.google}) **${key.name.default}** - ${key.pokemon.current.name}`])
            }
        }
        
        else {
            var NestNames = responseObject.map(key => [`[🗺️](${key.location.maps.google}) **${key.name.default}** - ${key.pokemon.current.name}`])
        }

    } 
    
    else {
        if(subcommand === "Reported" || subcommand === "R") {
            embed.setTitle(`**${servername} Reported Nests**`)

            // filter through nests for only reported nests
            let reportedNestsOnly = responseObject.filter(k => k.pokemon.current.name !== "?")

            if(bot.guildSettings.has(serverid, 'bots.miscord')) {
                if(miscord === true) {
                    var NestNames = reportedNestsOnly.map(key => [`🗺️ **${key.name.default}** - ${key.pokemon.current.name}`])
                } 
                
                else {
                    var NestNames = reportedNestsOnly.map(key => [`[**🗺️**](${key.location.maps.google}) **${key.name.default}** - ${key.pokemon.current.name}`])
                }
            } 
            
            else {
                var NestNames = reportedNestsOnly.map(key => [`[**🗺️**](${key.location.maps.google}) **${key.name.default}** - ${key.pokemon.current.name}`])
            }

        }
    }

    // finish building embed and send x amount
    embed.setDescription(NestNames.sort().slice(0, 10))
    embed.setFooter(`${NestNames.sort().slice(0, 0).length} - ${NestNames.sort().slice(0, 10).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
    message.channel.send({embed});

    if(NestNames.length > 9) {
        embed.setDescription(NestNames.sort().slice(10, 20))
        embed.setFooter(`${NestNames.sort().slice(0, 10).length} - ${NestNames.sort().slice(0, 20).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }

    if(NestNames.length > 19) {
        embed.setDescription(NestNames.sort().slice(20, 30))
        embed.setFooter(`${NestNames.sort().slice(0, 20).length} - ${NestNames.sort().slice(0, 30).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }

    if(NestNames.length > 29) {
        embed.setDescription(NestNames.sort().slice(30, 40))
        embed.setFooter(`${NestNames.sort().slice(0, 30).length} - ${NestNames.sort().slice(0, 40).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }

    if(NestNames.length > 39) {
        embed.setDescription(NestNames.sort().slice(40, 50))
        embed.setFooter(`${NestNames.sort().slice(0, 40).length} - ${NestNames.sort().slice(0, 50).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }
    
    if(NestNames.length > 49) {
        embed.setDescription(NestNames.sort().slice(50, 60))
        embed.setFooter(`${NestNames.sort().slice(0, 50).length} - ${NestNames.sort().slice(0, 60).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }

    if(NestNames.length > 59) {
        embed.setDescription(NestNames.sort().slice(60, 70))
        embed.setFooter(`${NestNames.sort().slice(0, 60).length} - ${NestNames.sort().slice(0, 70).length} of ${NestNames.length} total nests | Click 🗺️ for directions`)
        message.channel.send({embed: embed})
    }

}

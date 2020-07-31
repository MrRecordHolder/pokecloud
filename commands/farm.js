module.exports.command = {
    name: "farm",
    aliases: ["f"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/",
        video: ""
    },
    description: "Set Pokemon to receive notifications for via direct message. Notifications are only sent once a Pokemon is reported at a nest on a server you're in.",
    usage: "<pokemon>",
    example: "pikachu",
    permissions: {
        role: "Any",
        channel: "Any"
    },
}

const Discord = require("discord.js")
const utilities = require("../home/utilities.json")


exports.run = (bot, message, args) => {

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

    let serverid = message.guild.id
    let userid = message.author.id

    let dex = bot.goPokedex
    let profile = bot.trainerProfile

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    let output = args.join(" ").trim();

    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    let pokemon = capitalize_Words(output)

    // emoji support
    const emoji = require("../util/emoji.json")
    const verifiedEmoji = bot.emojis.get(emoji.verified);

    if(!profile.has(userid)) {
        return
    };


    // send initial response
    const master_embed = new Discord.RichEmbed()
    master_embed.setColor(utilities.colors.caution)
    master_embed.setDescription(`*Searching the Pokedex...*`)
    message.channel.send(master_embed).then(master_edit => {

        let pokemon_key = dex.findKey(p => p.name[language.toLowerCase()] === pokemon);
        
        setTimeout(function () {

            if(pokemon_key) {

                let farming = profile.get(userid, 'farm').sort().join(", ")

                // check to see if pokemon is already farmed
                if(farming.includes(pokemon_key)) {
                    master_embed.setColor(utilities.colors.error)
                    master_embed.setDescription(`❌ You are already farming **${pokemon_key}**...`)
                    return master_edit.edit(master_embed)
                } else {
                    profile.push(userid, pokemon_key, 'farm')
                }

                let shiny_general = dex.get(pokemon_key, 'shiny.general')
                let pokedex_number = dex.get(pokemon_key, 'dex')

                master_embed.setColor(utilities.colors.success)

                if(shiny_general === true) {
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${pokedex_number}-${pokemon_key.toLowerCase()}-shiny@3x.png?raw=true`
                } else {
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${pokedex_number}-${pokemon_key.toLowerCase()}@3x.png?raw=true`
                }

                master_embed.setThumbnail(pokemonImg)
                master_embed.setTitle(`**${verifiedEmoji} Notification Set For ${pokemon_key}!**`)
                master_embed.setDescription(`You will now recieve notifications via direct message for all servers you are in when **${pokemon_key}** is reported nesting.`)
                master_embed.setFooter(`You have earned 5 points toward your profile level!`)
                master_edit.edit(master_embed)

            } else {
                master_embed.setColor(utilities.colors.error)
                master_embed.setDescription(`❌ **Pokemon not found. Check the spelling and try again...**`)
                master_edit.edit(master_embed)
            };

        }, utilities.interval * 2);

    });
};
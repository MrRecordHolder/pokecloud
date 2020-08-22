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

    let serverid = message.guild.id
    let userid = message.author.id

    let user = message.mentions.users.first() || message.author
    let nickname = message.guild.member(user).displayName

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
    const greenCheckMarkEmoji = bot.emojis.get(utilities.emojis.green_check_mark);

    if(!profile.has(userid)) {
        return
    };


    // send initial response
    const master_embed = new Discord.RichEmbed()
    master_embed.setColor(utilities.colors.caution)
    master_embed.setDescription(`*Searching Pokedex & Profiles...*`)
    message.channel.send(master_embed).then(master_edit => {

        let pokemon_key = dex.findKey(p => p.name[language.toLowerCase()] === pokemon);
        
        setTimeout(function () {

            if(pokemon_key) {

                let farming = profile.get(userid, 'farm').sort().join(", ")


                let dexShiny = dex.get(pokemon, "shiny.wild")
                let dexNumber = dex.get(pokemon, "dex")
                if(dexShiny === true) { // if the species can be found shiny in the wild
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${pokemon.toLowerCase()}-shiny@3x.png?raw=true`
                } else { // if the species can not be found shiny in the wild
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}@3x.png?raw=true`
                };

                // check to see if pokemon is already farmed
                if(farming.includes(pokemon_key)) {
                    master_embed.setColor(utilities.colors.error)
                    master_embed.setThumbnail(pokemonImg)
                    master_embed.setTitle(`❌ Notification Disabled`)
                    master_embed.setDescription(`You will no longer receive notifications for **${pokemon_key}**.`)
                    profile.remove(userid, pokemon_key, 'farm')
                    master_edit.edit(master_embed)

                    var log = new Discord.RichEmbed()
                        .setTitle(`${pokemon_key} Notification Disabled`)
                        .setColor(utilities.colors.error)
                        .setDescription(`User: ${nickname}\nDiscord ID: ${userid}\nServer ID: ${serverid}`)
                    return bot.channels.get(utilities.channels.profile_log).send({embed: log})
                } else {
                    profile.push(userid, pokemon_key, 'farm')
                }


                
    
                master_embed.setThumbnail(pokemonImg)
                master_embed.setColor(utilities.colors.success)

                master_embed.setTitle(`${greenCheckMarkEmoji} Notification Set`)
                master_embed.setDescription(`You will now recieve notifications for __all__ servers you are in when **${pokemon_key}** is reported nesting.`)
                master_embed.setFooter(`❓ Run this command again to turn off notifications`)
                master_edit.edit(master_embed)



                var log = new Discord.RichEmbed()
                    .setTitle(`${pokemon_key} Notification Set`)
                    .setColor(utilities.colors.success)
                    .setDescription(`User: ${nickname}\nDiscord ID: ${userid}\nServer ID: ${serverid}`)
                bot.channels.get(utilities.channels.profile_log).send({embed: log})

            } else {
                master_embed.setColor(utilities.colors.error)
                master_embed.setTitle(`❌ Error`)
                master_embed.setDescription(`**Pokemon not found.** Check the spelling and try again...`)
                master_edit.edit(master_embed)
            };

        }, utilities.intervals.responses);

    });
};
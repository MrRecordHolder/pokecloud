module.exports.command = {
    name: "dex-toggle-shiny",
    aliases: ["dts"],
    category: "Pokedex",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands",
        video: ""
    },
    description: "Toggles a specific species shiny availability.",
    subcommands: "`general`\n`wild`\n`evolution`\n`alolan`",
    usage: "<pokemon>, <subcommand>",
    example: "pikachu, wild",
    permissions: {
        role: "Professor",
        channel: "update-pokedex"
    },
}

const Discord = require("discord.js")
const utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => { 

    let serverid = message.guild.id

    let dex = bot.goPokedex

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    if(message.channel.id !== utilities.channels.update_pokedex) {
        const embed = new Discord.RichEmbed()
            .setColor(utilities.colors.error)
            .setAuthor(respon.titles.error)
            .setDescription(respon.deny.professorsDexChannel)
        return message.channel.send(embed);
    };

    let output = args.join(" ").trim().split(",")
    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    if(output[0] && output[1]) {
        let pokemon = capitalize_Words(output[0])
        let subcommand = output[1].toLowerCase().trim();

        if(dex.has(pokemon)) {
            if(dex.hasProp(pokemon, `shiny.${subcommand}`)) {

                let toggle = dex.get(pokemon, subcommand)
                toggle = !toggle

                dex.delete(pokemon, toggle, subcommand)
                dex.set(pokemon, toggle, `shiny.${subcommand}`)

                var embed = new Discord.RichEmbed()
                    .setColor('RANDOM')
                    .setTitle(`${pokemon} updated!`)
                    .setDescription(`Shiny **${subcommand}** availability has been set to **${toggle}**`)
                    .setFooter(`Updated by ${message.author.username}`)
                message.channel.send(embed);
                bot.channels.get(utilities.channels.pokedex_log).send(embed);
            } else {
                message.reply(`**${subcommand}** is not a valid data field.`)
            }
        } else {
            message.reply(`**${pokemon} is not in the Pokedex or does not exisit. Check spelling and try again.`)
        };
    } else {
        return;
    };
};
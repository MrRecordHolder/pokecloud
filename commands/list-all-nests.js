module.exports.command = {
    name: "list-all-nests",
    aliases: ["lan"],
    category: "Nest Admin",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/list-all-nests",
        video: ""
    },
    description: "Lists all created nests in alphabetical order or use a subcommand to only list reported nests or nests located with-in a specific city.",
    subcommands: "`r` or `reported`\n`[city name]`",
    usage: "[subcommand]",
    example: "atlanta",
    permissions: {
        role: "admin",
        channel: "any"
    },
}


const Discord = require("discord.js")
const utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => { 

    message.delete(12000)
    
    let serverid = message.guild.id

    let nest = bot.defaultNest

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    // check role
    let adminrole = bot.guildSettings.get(serverid, 'roles.admin')
    if (!message.member.roles.some(r => r.id === adminrole)) {
        let adminRoleCheck = require(`../home/embeds/adminRoleCheck`);
        return adminRoleCheck.run(bot, message);
    };


    let output = args.join(" ").trim();

    var interval = 1000;

    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    let subcommand = capitalize_Words(output);

    // emoji support
    const emoji = require("../util/emoji.json")
    const pokestopEmoji = bot.emojis.get(emoji.pokestop);
    const gymEmoji = bot.emojis.get(emoji.gym);
    const spawnEmoji = bot.emojis.get(emoji.spawn);
    const exraidEmoji = bot.emojis.get(emoji.exgym);


    
    let current_server_nests = nest.filter(n => n.serverid === serverid);

    if(subcommand.length > 0) {
        if(subcommand === "R" || subcommand === "Reported") {
            let current_server_reported_nests = current_server_nests.filter(n => n.pokemon.current.name !== "?");
            var nests_to_display = current_server_reported_nests
        } else {
            let current_server_city_nests = current_server_nests.filter(n => n.location.city === subcommand);
            var nests_to_display = current_server_city_nests
        }
    } else {
        var nests_to_display = current_server_nests
    };


    nests_to_display.keyArray().sort().forEach(function (key, index) {                

        setTimeout(function () {
            
            // get nest data
            let nestname = nest.get(key, 'name.default')
            let pokestops = nest.get(key, 'pokestops')
            let gyms = nest.get(key, 'gyms')
            let exgyms = nest.get(key, 'exgyms')
            let spawns = nest.get(key, 'spawns')
            let googleLink = nest.get(key, 'location.maps.google')

            // get message & channel id
            let messagetodelete = nest.get(key, 'messageid')
            let channeltofind = nest.get(key, 'channelid')

            // get pokemon data
            let nestPokemon = nest.get(key, 'pokemon.current.name')
            let pokemonImage = nest.get(key, 'pokemon.current.image')

            if(nestPokemon !== "?") {
                var dexNumber = bot.goPokedex.get(nestPokemon, "dex")
                var dexPrimaryType = bot.goPokedex.get(nestPokemon, "type.primary")
                var dexSecondaryType = bot.goPokedex.get(nestPokemon, "type.secondary")
                var dexPrimaryBoost = bot.goPokedex.get(nestPokemon, "boost.primary")
                var dexSecondaryBoost = bot.goPokedex.get(nestPokemon, "boost.secondary")
                var dexShiny = bot.goPokedex.get(nestPokemon, "shiny.wild")
            };
            

            // emoji support
            const emoji = require("../util/emoji.json")
            const pokestopEmoji = bot.emojis.get(emoji.pokestop);
            const gymEmoji = bot.emojis.get(emoji.gym);
            const spawnEmoji = bot.emojis.get(emoji.spawn);
            const exraidEmoji = bot.emojis.get(emoji.exgym);
            let shinyEmoji = bot.emojis.find(emoji => emoji.name == `shiny_pc`);
            let sboostEmoji = bot.emojis.find(emoji => emoji.name == `${dexSecondaryBoost}_pc`);
            let pboostEmoji = bot.emojis.find(emoji => emoji.name == `${dexPrimaryBoost}_pc`);
            let stypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexSecondaryType}_pc`);
            let ptypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexPrimaryType}_pc`);

            // get last report date data
            let day = nest.get(key, 'lastReport.day')
            let month = nest.get(key, 'lastReport.month')
            let year = nest.get(key, 'lastReport.year')

            // generate & format date
            let reported_date = new Date(year, month, day)
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let reported_date_formatted = `${days[reported_date.getDay()]} ${months[reported_date.getMonth()]} ${reported_date.getDate()}, ${reported_date.getFullYear()}`

            // build nest embed
            const embed = new Discord.RichEmbed()

            embed.setTitle(`**${nestname}**`)

            if(exgyms < 1) {
                embed.setDescription(`[${respon.nest.directions}](${googleLink})\n${pokestopEmoji}${respon.nest.pokestops}: ${pokestops} ${gymEmoji}${respon.nest.gyms}: ${gyms}\n${spawnEmoji}${respon.nest.spawns}: ${spawns}`)
            } else {
                embed.setDescription(`[${respon.nest.directions}](${googleLink})\n${pokestopEmoji}${respon.nest.pokestops}: ${pokestops} ${gymEmoji}${respon.nest.gyms}: ${gyms}\n${exraidEmoji}${respon.nest.exgyms}: ${exgyms} ${spawnEmoji}${respon.nest.spawns}: ${spawns}`)
            }              

            
            if(nestPokemon !== "?") {
                if(capitalize_Words(dexPrimaryType) === "Normal") {
                    embed.setColor('CCD081')
                }
                if(capitalize_Words(dexPrimaryType) === "Fighting") {
                    embed.setColor('AE4F3C')
                }
                if(capitalize_Words(dexPrimaryType) === "Psychic") {
                    embed.setColor('D47FB3')
                }
                if(capitalize_Words(dexPrimaryType) === "Dragon") {
                    embed.setColor('494788')
                }
                if(capitalize_Words(dexPrimaryType) === "Water") {
                    embed.setColor('6DA0D0')
                }
                if(capitalize_Words(dexPrimaryType) === "Fairy") {
                    embed.setColor('FFC3D2')
                }
                if(capitalize_Words(dexPrimaryType) === "Ice") {
                    embed.setColor('BDEAF5')
                }
                if(capitalize_Words(dexPrimaryType) === "Flying") {
                    embed.setColor('C8AFD8')
                }
                if(capitalize_Words(dexPrimaryType) === "Ghost") {
                    embed.setColor('7F6193')
                }
                if(capitalize_Words(dexPrimaryType) === "Fire") {
                    embed.setColor('FF9051')
                }
                if(capitalize_Words(dexPrimaryType) === "Steel") {
                    embed.setColor('CECECE')
                }
                if(capitalize_Words(dexPrimaryType) === "Grass") {
                    embed.setColor('79CB7B')
                }
                if(capitalize_Words(dexPrimaryType) === "Ground") {
                    embed.setColor('DEE1A6')
                }
                if(capitalize_Words(dexPrimaryType) === "Rock") {
                    embed.setColor('AAAC72')
                }
                if(capitalize_Words(dexPrimaryType) === "Dark") {
                    embed.setColor('6F635B')
                }
                if(capitalize_Words(dexPrimaryType) === "Electric") {
                    embed.setColor('EEFC46')
                }
                if(capitalize_Words(dexPrimaryType) === "Poison") {
                    embed.setColor('7A5289')
                }
                if(capitalize_Words(dexPrimaryType) === "Bug") {
                    embed.setColor('B1C858')
                }
            
            
                if(dexShiny === true) {
                    if(dexSecondaryType === "") {
                        embed.addField(`#${dexNumber} **${nestPokemon}** ${shinyEmoji}`,`Type: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)}\nBoost: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)}`)
                    } else {
                        embed.addField(`#${dexNumber} **${nestPokemon}** ${shinyEmoji}`,`Types: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)} ${stypeEmoji} ${capitalize_Words(dexSecondaryType)}\nBoosts: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)} ${sboostEmoji} ${capitalize_Words(dexSecondaryBoost)}`)
                    }
                } else {
                    if(dexSecondaryType === "") {
                        embed.addField(`#${dexNumber} **${nestPokemon}**`,`Type: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)}\nBoost: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)}`)
                    } else {
                        embed.addField(`#${dexNumber} **${nestPokemon}**`,`Types: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)} ${stypeEmoji} ${capitalize_Words(dexSecondaryType)}\nBoosts: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)} ${sboostEmoji} ${capitalize_Words(dexSecondaryBoost)}`)
                    }
                };

                if(year === "" || !year) {
                    embed.setFooter(`No reports have been made`)
                } else {
                    embed.setFooter(`Last Report ${reported_date_formatted}`)
                }

                embed.setThumbnail(pokemonImage)
            } else {
                // nest does not have a nesting species
                embed.setThumbnail(utilities.images.unreported_nest)
                if(year === "" || !year) {
                    embed.setFooter(`No reports have been made`)
                } else {
                    embed.setFooter(`Last Report ${reported_date_formatted}`)
                };
            };

            // end nest embed build


        

            if(messagetodelete !== "") {

                if(bot.channels.some(ch => ch.id === channeltofind)) {
                    try {
                        message.guild.channels.find(c => c.id === channeltofind).fetchMessage(messagetodelete).then(oldembed => {
                            if(oldembed) {
                                oldembed.delete();
                            };
                        });
                    } catch {
                        // could not find the message
                    }
                } else {
                    // no channel found
                }
            };

            // send new nest embed
            message.channel.send(embed).then(message => {
                // save the sent embed message id
                bot.defaultNest.set(key, message.channel.lastMessageID, "messageid")
                bot.defaultNest.set(key, message.channel.id, "channelid")
            });


        }, index * utilities.interval);       
    });
};
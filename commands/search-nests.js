module.exports.command = {
    name: "search-nests",
    aliases: ["sn"],
    category: "Tools",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/search-nests",
        video: ""
    },
    description: "Search nests local, statewide, and worldwide using the Pokemon name.",
    usage: "<pokemon>",
    example: "pikachu",
    permissions: {
        role: "any",
        channel: "any"
    },
}

const Discord = require("discord.js")
const color = require("../home/colors.json")
const image = require("../home/images.json")
const defaultNest = require("../keys/defaultNest")

let utilities = require("../home/utilities.json")
const goPokedex = require("../keys/goPokedex")

exports.run = (bot, message, args) => { 

    let serverid = message.guild.id
    let userid = message.author.id

    let profile = bot.trainerProfile
    let nest = bot.defaultNest
    let guildSettings = bot.guildSettings
    let goPokedex = bot.goPokedex

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/languages/" + language.toLowerCase() + ".json")



    let userInput = args.join(" ").trim().split(",")
    let pokemon = capitalize_Words(userInput[0])
    
    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };



    ///// POKEMON FOUND
    if(goPokedex.has(pokemon)) {
        //get pokemon nesting capability
        let p_nest = goPokedex.get(pokemon, 'nest')
        if(p_nest === true) {




            // get server data
            let serverState = guildSettings.get(serverid, 'location.state')
            let serverCity = guildSettings.get(serverid, 'location.city')



            // get pokemon data
            let dexShiny = bot.goPokedex.get(pokemon, "shiny.general")
            let dexNumber = bot.goPokedex.get(pokemon, "dex")
            let dexPrimaryType = bot.goPokedex.get(pokemon, "type.primary")
            let ptypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexPrimaryType}_pc`);
            let dexSecondaryType = bot.goPokedex.get(pokemon, "type.secondary")
            let stypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexSecondaryType}_pc`);




            // get emojis
            let shinyEmoji = bot.emojis.find(emoji => emoji.name == `shiny_pc`);


            // all
            let s_pokemon = nest.filter(key => key.pokemon.current.name === pokemon);
            let s_pokemon_map = s_pokemon.map(key => [`📍 **[${key.name.default}](${key.location.maps.google})**`]).sort()


            // citywide
            let s_pokemon_local = s_pokemon.filter(v => v.serverid === serverid);
            let s_pokemon_citywide_map = s_pokemon_local.map(key => [`📍 **[${key.name.default}](${key.location.maps.google})**`]).sort()
            // statewide
            let s_pokemon_statewide = s_pokemon.filter(v => v.location.state === serverState);
            let s_pokemon_statewide_notLocal = s_pokemon_statewide.filter(v => v.serverid !== serverid);
            let s_pokemon_statewide_map = s_pokemon_statewide_notLocal.map(key => [`📍 **[${key.name.default}](${key.location.maps.google})** - ${key.location.city}`]).sort()
            //global
            let s_pokemon_global = s_pokemon.filter(v => v.location.state !== serverState);
            let s_pokemon_global_not_local = s_pokemon_global.filter(v => v.serverid !== serverid);
            let s_pokemon_global_map = s_pokemon_global_not_local.map(key => [`📍 **[${key.name.default}](${key.location.maps.google})**\n${key.location.city}, ${key.location.state}, ${key.location.country}`]).sort()


            
            const results = new Discord.RichEmbed()

            results.setTitle(`Searching ${nest.size} nests...`)

                
            return message.channel.send(results).then(editEmbed => {

                if(s_pokemon_map.length > 0) {
                    setTimeout(function () {
                        results.setAuthor(`${s_pokemon_map.length} results found`)
                        
                        if(dexShiny === true) {
                            results.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${pokemon.toLowerCase()}-shiny@3x.png?raw=true`)
                            if(dexSecondaryType === "") {
                                results.setTitle(`#${dexNumber} **${pokemon}** ${shinyEmoji} ${ptypeEmoji}`)
                            } else {
                                results.setTitle(`#${dexNumber} **${pokemon}** ${shinyEmoji} ${ptypeEmoji} ${stypeEmoji}`)
                            }
                        } 
                        else {
                            results.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${pokemon.toLowerCase()}@3x.png?raw=true`)
                            if(dexSecondaryType === "") {
                                results.setTitle(`#${dexNumber} **${pokemon}** ${shinyEmoji} ${ptypeEmoji}`)
                            } else {
                                results.setTitle(`#${dexNumber} **${pokemon}** ${shinyEmoji} ${ptypeEmoji} ${stypeEmoji}`)
                            }
                        };
                        
                
                        if(s_pokemon_citywide_map.length > 0) {
                            results.addField(`__**Local**__ (*${s_pokemon_citywide_map.slice(0,5).length}/${s_pokemon_citywide_map.length} results)*`, s_pokemon_citywide_map.slice(0,5))
                        };
                        if(s_pokemon_statewide_map.length > 0) {
                            results.addField(`__**${serverState}**__ *(${s_pokemon_statewide_map.slice(0,5).length}/${s_pokemon_statewide_map.length} results)*`, s_pokemon_statewide_map.slice(0,5)) 
                        };


                        if(s_pokemon_citywide_map.length === 0 && s_pokemon_statewide_map.length === 0) {
                            results.setDescription(`No local or statewide nests were found...`)
                        }
                        
                        editEmbed.edit(results)








                        ///// GLOBAL REACTION
                        if(s_pokemon_global_map.length > 0) {
                            editEmbed.react('🌎');
                            
                            results.setFooter(`React with 🌎 to see worldwide results`);

                            editEmbed.edit(results);

                            
                            
                            

                            const filter = (reaction, user) => {
                                return ['🌎'].includes(reaction.emoji.name) && user.id === message.author.id;
                            };

                            editEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '🌎') {
                                    editEmbed.reactions.forEach(reaction => reaction.remove())
                                    editEmbed.reactions.forEach(reaction => reaction.remove(userid))
                                                        
                                    results.addField(`__**Global**__ *(${s_pokemon_global_map.slice(0,5).length}/${s_pokemon_global_map.length} results)*`, s_pokemon_global_map.slice(0,5))
                                    results.setFooter(` `)
                                    editEmbed.edit(results)





                                    
                                    ///// MORE RESULTS REACTION
                                    if(s_pokemon_citywide_map.length > 5 || s_pokemon_statewide_map.length > 5 || s_pokemon_global_map.length > 5) {
                                        results.setFooter(`React with ⏩ to see more results`)
                                        editEmbed.edit(results)
                                        editEmbed.react('⏩')

                                        const filter = (reaction, user) => {
                                            return ['⏩'].includes(reaction.emoji.name) && user.id === message.author.id;
                                        };
    
                                        editEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                        .then(collected => {
                                            const reaction = collected.first();
    
                                            if (reaction.emoji.name === '⏩') {
                                                results.fields.length = 0
                                                

                                                if(s_pokemon_citywide_map.length > 5) {
                                                    results.addField(`__**Local**__ *(${s_pokemon_citywide_map.slice(0,10).length}/${s_pokemon_citywide_map.length} results)*`, s_pokemon_citywide_map.slice(5,10))
                                                };
                                                if(s_pokemon_statewide_map.length > 5) {
                                                    results.addField(`__**${serverState}**__ *(${s_pokemon_statewide_map.slice(0,10).length}/${s_pokemon_statewide_map.length} results)*`, s_pokemon_statewide_map.slice(5,10)) 
                                                };


                                                results.addField(`__**Global (cont)**__ *(${s_pokemon_global_map.slice(0,10).length}/${s_pokemon_global_map.length} results)*`, s_pokemon_global_map.slice(5,10))
                                                results.setFooter(`React with ⏩ for more or ⏪ for previous results`)
                                                editEmbed.edit(results)
                                                editEmbed.reactions.forEach(reaction => reaction.remove(userid))
                                                editEmbed.reactions.forEach(reaction => reaction.remove())






                                                //// BACK BUTTON

                                                editEmbed.react('⏪').then(() => {
                                                    editEmbed.react('⏩')
                                                })
                                                
                                                const filter = (reaction, user) => {
                                                    return ['⏪', '⏩'].includes(reaction.emoji.name) && user.id === message.author.id;
                                                };
            
                                                editEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                                .then(collected => {
                                                    const reaction = collected.first();

                                                    results.fields.length = 0

                                                    if(reaction.emoji.name === '⏪') {
                                                        if(s_pokemon_citywide_map.length > 0) {
                                                            results.addField(`__**Local**__ *(${s_pokemon_citywide_map.slice(0,10).length}/${s_pokemon_citywide_map.length} results)*`, s_pokemon_citywide_map.slice(0,5))
                                                        };
                                                        if(s_pokemon_statewide_map.length > 0) {
                                                            results.addField(`__**${serverState}**__ *(${s_pokemon_statewide_map.slice(0,10).length}/${s_pokemon_statewide_map.length} results)*`, s_pokemon_statewide_map.slice(0,5)) 
                                                        };
        
        
                                                        results.addField(`__**Global (cont)**__ *(${s_pokemon_global_map.slice(0,10).length}/${s_pokemon_global_map.length} results)*`, s_pokemon_global_map.slice(0,5))
                                                        results.setFooter(` `)
                                                        editEmbed.reactions.forEach(reaction => reaction.remove())
                                                        editEmbed.reactions.forEach(reaction => reaction.remove(userid))
                                                        editEmbed.edit(results)
                                                    };

                                                    if(reaction.emoji.name === '⏩') {
                                                        results.fields.length = 0

                                                        if(s_pokemon_citywide_map.length > 10) {
                                                            results.addField(`__**Local**__ *(${s_pokemon_citywide_map.slice(0,15).length}/${s_pokemon_citywide_map.length} results)*`, s_pokemon_citywide_map.slice(10,15))
                                                        };
                                                        if(s_pokemon_statewide_map.length > 10) {
                                                            results.addField(`__**${serverState}**__ *(${s_pokemon_statewide_map.slice(0,15).length}/${s_pokemon_statewide_map.length} results)*`, s_pokemon_statewide_map.slice(10,15)) 
                                                        };
                                                        if(s_pokemon_global_map.length > 10) {
                                                            results.addField(`__**Global (cont)**__ *(${s_pokemon_global_map.slice(0,15).length}/${s_pokemon_global_map.length} results)*`, s_pokemon_global_map.slice(10,15))
                                                        }
        
        
                                                        results.setFooter(` `)
                                                        editEmbed.reactions.forEach(reaction => reaction.remove())
                                                        editEmbed.reactions.forEach(reaction => reaction.remove(userid))
                                                        editEmbed.edit(results)
                                                    };


                                                })
                                                .catch(collected => {
                                                    // NO REACTION, TIME RAN OUT
                                                    editEmbed.reactions.forEach(reaction => reaction.remove())
                                                    results.setFooter(` `)
                                                    editEmbed.edit(results)
                                                });


                                            };
                                        })
                                        .catch(collected => {
                                            // NO REACTION, TIME RAN OUT
                                            editEmbed.reactions.forEach(reaction => reaction.remove())
                                            results.setFooter(` `)
                                            editEmbed.edit(results)
                                        });
                                    };
                                    
                                    

                                    


                                    
                                };
                            })
                            .catch(collected => {
                                // NO REACTION, TIME RAN OUT
                                editEmbed.reactions.forEach(reaction => reaction.remove())
                                results.setFooter(` `)
                                editEmbed.edit(results)
                            });
                        };











                        





                    }, utilities.interval);
                } else {

                    
                    setTimeout(function () {
                        ////NO RESULTS FOUND
                        if(dexShiny === true) {
                            results.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${pokemon.toLowerCase()}-shiny@3x.png?raw=true`)
                            results.setTitle(`#${dexNumber} **${pokemon}** ${shinyEmoji}`)
                        } 
                        else {
                            results.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${pokemon.toLowerCase()}@3x.png?raw=true`)
                            results.setTitle(`#${dexNumber} **${pokemon}**`)
                        };

                        results.setDescription(`No results were found... Try again`)
                        editEmbed.edit(results)
                    }, utilities.interval);
                };
            });

            
        } else {
            // pokemon can not nest
            var embed = new Discord.RichEmbed()
                .setColor(utilities.colors.error)
                .setTitle(`${pokemon} can not nest`)    
            return message.channel.send({embed: embed}) 
        };
    } else {
        // pokemon does not exist
        var embed = new Discord.RichEmbed()
                .setColor(utilities.colors.error)
                .setTitle(`${pokemon} is not in the Pokedex`)  
                .setDescription(`*Be sure to check your spelling*`)  
            return message.channel.send({embed: embed}) 
    };

    
};


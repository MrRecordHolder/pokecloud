module.exports.command = {
    name: "update-nest",
    aliases: ["un"],
    category: "Nest Admin",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/update-nest",
        video: ""
    },
    description: "Update a nest using emoji reactions or directy using the property name.",
    subcommands: "pokestops, gyms, ex gyms, spawns, city, state, country, map or coordinates, alias",
    usage: "<nest name>, [property], [new value]",
    example: "test park",
    permissions: {
        role: "admin",
        channel: "admin"
    },
};

const Discord = require("discord.js")
const color = require("../home/colors.json")
const image = require("../home/images.json")

let utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => { 

    let serverid = message.guild.id
    let userid = message.author.id

    let profile = bot.trainerProfile
    let nest = bot.defaultNest

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

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

    let output = args.join(" ").trim().split(",")    

    let mapName = args.join("+").split(",")

    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    let Prefix = bot.guildSettings.get(serverid, "server.prefix")

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

    // error -> no nest name provided
    if(!output[0]){
        const embed = new Discord.RichEmbed()
            .setColor(color.error)
            .setAuthor(respon.titles.error)
            .setDescription(respon.args.nest_name)
            .addField(respon.titles.example, Prefix + this.command.usage)
        return message.channel.send(embed);
    };

    // generate nest name
    let nestName = capitalize_Words(output[0]).replace(/&/g,'And')

    // generate nest key
    let key = `${serverid}-${nestName}`

    // check to ensure nest exists
    if(!nest.has(key)) {
        console.log("yup")
        // nest not found, search for alias
        let aliasSearch = nest.filter(n => n.name.alias === nestName);
        let aliasServerSearch = aliasSearch.filter(n => n.serverid === serverid)
        let nestAliasMap = aliasServerSearch.map(n => [`${n.serverid}-${n.name.default}`])
        let nestAlias = nestAliasMap.toString()

        // check how many nests were found
        // under construction

        // nest alias found
        if(nest.has(nestAlias)) {
            key = nestAlias
        } else { // nest does not exist
            var embed = new Discord.RichEmbed()
                .setColor(color.error)
                .setAuthor(respon.titles.error)
                .setDescription(`**${nestName}** ${respon.deny.nestDontExist}`)
            return message.channel.send({embed: embed});
        };
    };


    // emoji support
    const emojiSupport = require("../home/utilities.json")
    const emoji = emojiSupport.emojis
    const pokestopEmoji = bot.emojis.get(utilities.emojis.pokestop);
    const gymEmoji = bot.emojis.get(utilities.emojis.gym);
    const spawnEmoji = bot.emojis.get(utilities.emojis.spawn);
    const exraidEmoji = bot.emojis.get(utilities.emojis.exgym);
    const verifiedEmoji = bot.emojis.get(utilities.emojis.verified);
    const cityEmoji = bot.emojis.get(utilities.emojis.city)
    const stateEmoji = bot.emojis.get(utilities.emojis.state);
    const countryEmoji = bot.emojis.get(utilities.emojis.country);  
    const lat_lon_emoji = bot.emojis.get(utilities.emojis.lat_lon); 
    const aliasEmoji = bot.emojis.get(utilities.emojis.alias);    

    let nestchannel = bot.defaultNest.get(key, 'channelid')
    let messageid = bot.defaultNest.get(key, 'messageid')
    let Discord_message_link = `https://discordapp.com/channels/${serverid}/${nestchannel}/${messageid}`


    // get nest data
    var nest_name = nest.get(key, 'name.default')
    var pokestops = nest.get(key, 'pokestops')
    var gyms = nest.get(key, 'gyms')
    var exgyms = nest.get(key, 'exgyms')
    var spawns = nest.get(key, 'spawns')
    var google_map = nest.get(key, 'location.maps.google')
    var city = nest.get(key, 'location.city')
    var state = nest.get(key, 'location.state')
                            



    // nest name only
    if(output.length === 1){        

        // build nest edit embed
        const embed = new Discord.RichEmbed()
        embed.setColor(color.success)
        embed.setThumbnail(utilities.images.warning)
        embed.setTitle(`${nest_name}`)
        embed.setDescription(`${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
        embed.addField(`**React with an emoji to update**`, `${pokestopEmoji} = Pokestops\n${gymEmoji} = Gyms\n${exraidEmoji} = Ex Gyms\n${spawnEmoji} = Spawns\n${cityEmoji} = City\n${stateEmoji} = State\n${countryEmoji} = Country\n${lat_lon_emoji}= Map Coordinates\n${aliasEmoji} = Alias *(nickname)*`)
        embed.setFooter(`Each response request will auto-cancel in 30 seconds`)
        
        // send nest edit embed
        message.channel.send(embed).then(msg => {
            
            // react with proper emojis
            msg.react(pokestopEmoji)
            .then(() => msg.react(gymEmoji))
            .then(() => msg.react(exraidEmoji))
            .then(() => msg.react(spawnEmoji))
            .then(() => msg.react(cityEmoji))
            .then(() => msg.react(stateEmoji))
            .then(() => msg.react(countryEmoji))
            .then(() => msg.react(lat_lon_emoji))
            .then(() => msg.react(aliasEmoji))

            const filter = (reaction, user) => {
                return [
                    emoji.pokestop, emoji.gym, emoji.exgym, emoji.spawn, 
                    emoji.city, emoji.state, emoji.country, utilities.emojis.lat_lon,
                    emoji.alias
                ]
                .includes(reaction.emoji.id) && user.id !== msg.author.id;
            };
            
            msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
        






                // pokestops
                if (reaction.emoji.id === emoji.pokestop) {

                    message.reply(`How many **Pokestops** are at **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            nest.set(key, `${collected.first().content}`, 'pokestops')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been updated to ${collected.first().content} Pokestops!`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${collected.first().content} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${collected.first().content} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);  





                                // points
                                if(profile.has(userid)) {
                                    let current_points = profile.get(userid, 'points.total')
                                    let new_points = current_points + utilities.points.update_nest

                                    // add new points
                                    profile.set(userid, new_points, 'points.total')

                                    // generate level
                                    if(current_points < 100 && new_points > 99) {
                                        profile.set(userid, 2, 'points.level')
                                        // send direct message
                                        message.author.send(`**You have leveled up to Level 2!**\nTotal Points: ${new_points}/199`)
                                    }

                                    console.log(current_points)
                                };

                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Pokestops were __not__ updated`);
                        });
                    });

                };















                // gyms
                if (reaction.emoji.id === emoji.gym) {

                    message.reply(`How many **Gyms** are at **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            nest.set(key, `${collected.first().content}`, 'gyms')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been updated to ${collected.first().content} Gyms!`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${collected.first().content}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${collected.first().content}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3); 
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Pokestops were __not__ updated`);
                        });
                    });
                };








                // ex gyms
                if (reaction.emoji.id === emoji.exgym) {

                    message.reply(`How many **Ex Gyms** are at **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            nest.set(key, `${collected.first().content}`, 'exgyms')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been updated to ${collected.first().content} Ex Gyms!`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms === 0) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${collected.first().content} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Ex Gyms were __not__ updated`);
                        });
                    });
                };










                

                // spawns
                if (reaction.emoji.id === emoji.spawn) {

                    message.reply(`How many **Spawns** are at **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            nest.set(key, `${collected.first().content}`, 'spawns')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been updated to ${collected.first().content} Spawns!`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms === 0) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${collected.first().content}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${collected.first().content}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Spawns were __not__ updated`);
                        });
                    });
                };




                // city
                if (reaction.emoji.id === emoji.city) {

                    message.reply(`What **City** is **${nest_name}** located in?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            let cityName = capitalize_Words(collected.first().content)
                            nest.set(key, cityName, 'location.city')

                            let stateName = bot.guildSettings.get(serverid, "location.state")

                            let newMapLink = `https://www.google.com/maps/search/?api=1&query=${mapName[0].replace(/&/g,'and')}+${cityName.replace(/\s/g,'+')}+${stateName.replace(/\s/g,'+')}`
                            nest.set(key, newMapLink, 'location.maps.google')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been relocated to **${cityName}**`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${newMapLink})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${newMapLink})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** City was __not__ updated`);
                        });
                    });
                };




                // state
                if (reaction.emoji.id === emoji.state) {

                    message.reply(`What **State** is **${nest_name}** located in?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            let stateName = capitalize_Words(collected.first().content)
                            nest.set(key, stateName, 'location.city')

                            let cityName = bot.guildSettings.get(serverid, "location.city")

                            let newMapLink = `https://www.google.com/maps/search/?api=1&query=${mapName[0].replace(/&/g,'and')}+${cityName.replace(/\s/g,'+')}+${stateName.replace(/\s/g,'+')}`
                            nest.set(key, newMapLink, 'location.maps.google')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been relocated to **${stateName}**`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${newMapLink})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${newMapLink})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** State was __not__ updated`);
                        });
                    });
                };




                // country
                if (reaction.emoji.id === emoji.country) {

                    message.reply(`What **Country** is **${nest_name}** located in?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            
                            // save new data
                            let countryName = capitalize_Words(collected.first().content)
                            nest.set(key, countryName, 'location.country')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`${nest_name} has been relocated to **${countryName}**`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Country was __not__ updated`);
                        });
                    });
                };


                // map coordinates
                if (reaction.emoji.id === emoji.lat_lon) {

                    message.reply(`What is the latitude of **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
          
                            lat = collected.first().content

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** latitude was __not__ updated`);
                        }).then(next_question => {
                            message.reply(`What is the longitude of **${nest_name}**?`).then(() => {

                                message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                  
                                    let lon = collected.first().content
                                    

                                    nest.set(key, `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, 'location.maps.google')
                                    let coordinateMap = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`


                                    // inform user of changes
                                    const confirm_embed = new Discord.RichEmbed()
                                    confirm_embed.setColor(color.success)
                                    confirm_embed.setTitle(`${nest_name} has been relocated to ${lat}, ${lon}`)
                                    // send nest confirmation embed
                                    message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                        setTimeout(function () {
                                            confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                            editConfirmEmbed.edit(confirm_embed)
                                        }, utilities.interval);
                                            
                                            
                                            
                                        setTimeout(function () {
                                            // edit listed nest
                                            if(bot.channels.some(ch => ch.id === nestchannel)) {
                                                bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                                    const { RichEmbed } = require ('discord.js');
                                                    const embed = new RichEmbed (editEmbed.embeds[0])
                                                    
                                                    if(exgyms < 1) {
                                                        embed.setDescription(`[${respon.nest.directions}](${coordinateMap})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${collected.first().content}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                                    } else {
                                                        embed.setDescription(`[${respon.nest.directions}](${coordinateMap})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${collected.first().content}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                                    } 
                                                    editEmbed.edit(embed);

                                                    // edit confirmation embed
                                                    confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                                    editConfirmEmbed.edit(confirm_embed)

                                                }).catch(error => {
                                                    setTimeout(function () {
                                                        confirm_embed.setDescription(`❌ Listed nest not found`)
                                                        editConfirmEmbed.edit(confirm_embed)
                                                    }, utilities.interval);
                                                });
                                                
                                            };
                                        }, utilities.interval * 3); 
                                    });

        
                                }).catch(() => { // time ran out & data not provided
                                    message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** latitude was __not__ updated`);
                                })
                            });
                        })
                    });
                };



                // alias
                if (reaction.emoji.id === emoji.alias) {

                    message.reply(`What alias would you like to use instead of **${nest_name}**?`).then(() => {

                        message.channel.awaitMessages(response => response.author.id !== '623524682879991851', {max: 1, time: 30000, errors: ['time'],}).then((collected) => {
                            let aliasName = capitalize_Words(collected.first().content)
                            // save new data
                            nest.set(key, aliasName, 'name.alias')
                            
                            // inform user of changes
                            const confirm_embed = new Discord.RichEmbed()
                            confirm_embed.setColor(color.success)
                            confirm_embed.setTitle(`The alias for ${nest_name} has been updated to **${aliasName}**`)
                            // send nest confirmation embed
                            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                                setTimeout(function () {
                                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                                    editConfirmEmbed.edit(confirm_embed)
                                }, utilities.interval);
                                    
                                    
                                    
                                setTimeout(function () {
                                    // edit listed nest
                                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                                            const { RichEmbed } = require ('discord.js');
                                            const embed = new RichEmbed (editEmbed.embeds[0])
                                            
                                            if(exgyms < 1) {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${collected.first().content} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } else {
                                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${collected.first().content} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                                            } 
                                            editEmbed.edit(embed);

                                            // edit confirmation embed
                                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                                            editConfirmEmbed.edit(confirm_embed)

                                        }).catch(error => {
                                            setTimeout(function () {
                                                confirm_embed.setDescription(`❌ Listed nest not found`)
                                                editConfirmEmbed.edit(confirm_embed)
                                            }, utilities.interval);
                                        });
                                        
                                    };
                                }, utilities.interval * 3);  
                            });

                        }).catch(() => { // time ran out & data not provided
                            message.channel.send(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}'s** Pokestops were __not__ updated`);
                        });
                    });

                };

            }).catch(collected => { // no reaction found
                message.reply(`**UPDATE TIME EXPIRED!** 🚨 **${nest_name}** was __not__ updated`);
            });
        });
    };







    // error
    if(output.length === 2) {
        message.reply('Try again...')
    }




    // nest name, prop, value
    if(output.length > 2) {

        let PROP = output[1].toLowerCase().trim()

        if(output[2]) {

            let NEW_VALUE = output[2].trim()
            
            if(PROP === "pokestops") {
                nest.set(key, NEW_VALUE, 'pokestops')
            } else if(PROP === "gyms") {
                nest.set(key, NEW_VALUE, 'gyms')
            } else if(PROP === "exgyms") {
                nest.set(key, NEW_VALUE, 'exgyms')
            } else if(PROP === "spawns") {
                nest.set(key, NEW_VALUE, 'spawns')
            } else if(PROP === "city") {
                nest.set(key, NEW_VALUE, 'location.city')
            } else if(PROP === "state") {
                nest.set(key, NEW_VALUE, 'location.state')
            } else if(PROP === "country") {
                nest.set(key, NEW_VALUE, 'location.country')
            } else if(PROP === "map" || PROP === "coordinates") {
                if(output[3]) {
                    // lat & lon
                    var NEW_VALUE_2 = output[3].trim()
                    nest.set(key, NEW_VALUE, 'location.maps.lat')
                    nest.set(key, NEW_VALUE_2, 'location.maps.lon')
                } else {
                    // lat only
                    nest.set(key, NEW_VALUE, 'location.maps.lat')
                }
            } else {
                return;
            }



            // get nest data in case it was updated
            var nest_name = nest.get(key, 'name.default')
            var pokestops = nest.get(key, 'pokestops')
            var gyms = nest.get(key, 'gyms')
            var exgyms = nest.get(key, 'exgyms')
            var spawns = nest.get(key, 'spawns')
            var city = nest.get(key, 'location.city')
            var state = nest.get(key, 'location.state')
            var lat = nest.get(key, 'location.maps.lat')
            var lon = nest.get(key, 'location.maps.lon')

            if(lat !== "" && lon !== "") {
                nest.set(key, `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, 'location.maps.google')
            };

            var google_map = nest.get(key, 'location.maps.google')
            

            // inform user of changes
            const confirm_embed = new Discord.RichEmbed()
            confirm_embed.setColor(utilities.colors.success)
            if(PROP === "map" || PROP === "coordinates") {
                confirm_embed.setTitle(`${nest_name} has been relocated to **${NEW_VALUE}, ${NEW_VALUE_2}**`)
            } else {
                confirm_embed.setTitle(`${nest_name} has been updated to **${NEW_VALUE} ${capitalize_Words(PROP)}**`)
            }
            // send nest confirmation embed
            message.channel.send(confirm_embed).then(editConfirmEmbed => {

                setTimeout(function () {
                    confirm_embed.setDescription(`*Searching for the listed nest...*`)
                    editConfirmEmbed.edit(confirm_embed)
                }, utilities.interval);



                setTimeout(function () {
                    // edit listed nest
                    if(bot.channels.some(ch => ch.id === nestchannel)) {
                        bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                            const { RichEmbed } = require ('discord.js');
                            const embed = new RichEmbed (editEmbed.embeds[0])
                            
                            if(exgyms < 1) {
                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${spawnEmoji}Spawns Per Visit: ${spawns}`)
                            } else {
                                embed.setDescription(`[${respon.nest.directions}](${google_map})\n${pokestopEmoji}Pokestops: ${pokestops} ${gymEmoji}Gyms: ${gyms}\n${exraidEmoji}Ex Gyms: ${exgyms} ${spawnEmoji}Spawns Per Visit: ${spawns}`)
                            } 
                            editEmbed.edit(embed);

                            // edit confirmation embed
                            confirm_embed.setDescription(`${verifiedEmoji} Listed nest found & updated!\n[**Click here to view the nest**](${Discord_message_link})`)
                            editConfirmEmbed.edit(confirm_embed)

                        }).catch(error => {
                            console.error(error)
                            bot.channels.get(utilities.channels.error_log).send(error)
                        });
                        
                    };
                }, utilities.interval * 2.5);




            }).catch(error => {

            })
        };
    };
    
};
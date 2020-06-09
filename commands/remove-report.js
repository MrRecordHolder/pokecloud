module.exports.command = {
    name: "remove-report",
    aliases: ["rr"],
    category: "Nest Admin",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/remove-report",
        video: ""
    },
    description: "Removes the last report for the specified nest with-in the current community.",
    usage: "<nest name>",
    example: "hilton park",
    permissions: {
        role: "admin",
        channel: "any"
    },
}

const Discord = require("discord.js")
const color = require("../home/colors.json")
const image = require("../home/images.json")


exports.run = (bot, message, args) => {

    let serverid = message.guild.id
    let current_channel = message.channel.id

    // get language & correct responses
    let language = bot.guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    // check role
    let adminrole = bot.guildSettings.get(serverid, 'roles.admin')

    // ensure timezone is set
    

    if (!message.member.roles.some(r => r.id === adminrole)) {
        let reporterRoleCheck = require(`../home/embeds/adminRoleCheck`);
        return reporterRoleCheck.run(bot, message);
    };

    if(!args[0]) {
        var embed = new Discord.RichEmbed()
            .setTitle(respon.titles.error)
            .setColor(color.error)
            .setDescription(`You must provide the nest name`)
            .addField("Example", `${this.command.aliases} ${this.command.example}`)
        return message.channel.send({embed: embed})
    };

    let output = args.join(" ").trim().split(",")

    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    let nestName = capitalize_Words(output[0])

    let nestKey = `${message.guild.id}-${nestName}`

    if(!bot.defaultNest.has(nestKey)) {

        let aliasSearch = bot.defaultNest.filter(n => n.name.alias === nestName);
        let aliasServerSearch = aliasSearch.filter(n => n.serverid === serverid)
        let nestAliasMap = aliasServerSearch.map(n => [`${n.serverid}-${n.name.default}`])
        let nestAlias = nestAliasMap.toString()

        if(bot.defaultNest.has(nestAlias)) {
            nestKey = nestAlias
        } else {
            var embed = new Discord.RichEmbed()
                .setColor(color.error)
                .setAuthor(respon.titles.error)
                .setDescription(`**${nestName}** ${respon.deny.nestDontExist}`)
            return message.channel.send({embed: embed});
        }
    };

    let nestserverid = bot.defaultNest.get(nestKey, 'serverid')
    if(nestserverid === serverid) {    

        bot.defaultNest.set(nestKey, `?`, `pokemon.current.name`)
        bot.defaultNest.set(nestKey, `https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true`, `pokemon.current.image`)


        let channeltofind = bot.defaultNest.get(nestKey, 'channelid')

        if(channeltofind !== "") {
            if(bot.channels.some(ch => ch.id === channeltofind)) {
                
                
                let messagetoedit = bot.defaultNest.get(nestKey, 'messageid')

                bot.channels.get(channeltofind).fetchMessage(messagetoedit).then(editEmbed => {
                    const { RichEmbed } = require ('discord.js');
                    const embed = new RichEmbed (editEmbed.embeds[0])
                    embed.fields.length = 0
                    embed.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true`);
                    embed.setColor('#000000');
                    
                    editEmbed.edit(embed)
                    
                }).catch(console.error());
                
                

                let Discord_message_link = `https://discordapp.com/channels/${serverid}/${channeltofind}/${messagetoedit}`

                const embed_confirm = new Discord.RichEmbed()
                embed_confirm.setColor(color.success)
                embed_confirm.setAuthor(respon.titles.success)
                embed_confirm.setDescription(`The last report for **${nestName}** has been removed.\n[**Click here to view the nest**](${Discord_message_link})`)
                embed_confirm.setThumbnail(`https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true`);
                if(current_channel === channeltofind) {
                    embed_confirm.setFooter(respon.auto_delete.a, image.warning)
                };
                message.channel.send(embed_confirm).then(msg => {
                    if(current_channel === channeltofind) {
                        setTimeout(function(){ 
                            message.delete()
                            msg.delete()
                        }, 60000);
                    };
                });
            };
        };
    }
};
module.exports.command = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "View the top ranking PokeCloud Trainers from around the world.",
    category: "Tools",
    usage: "",
    example: "",
    link: "https://pokecloud.gitbook.io/pokecloud/v/public/commands",
}



const Discord = require("discord.js")
let utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => { 

    let trainerProfile = bot.trainerProfile

    const all_trainer_names = trainerProfile.filter(t => t.trainer.name !== "").array()

  const sorted_points = all_trainer_names.sort((a, b) => b.stats.total_points - a.stats.total_points);

  const top10_points = sorted_points.splice(0, 10);
  const top10_points_map = top10_points.map(t => [`${t.trainer.name} - ${t.stats.total_points}`])



  const embed = new Discord.RichEmbed()
    .setTitle("Leaderboard")
    .setDescription(top10_points_map)
    .setAuthor(bot.user.username, bot.user.avatarURL)
    .setColor(0x00AE86)
    .setFooter(`This feature is in early beta testing`)
  return message.channel.send({embed});
    
};
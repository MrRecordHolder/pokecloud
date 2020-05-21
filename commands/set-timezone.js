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
const guildSettings = {
    server: {
        name: "",
        id: "",
        language: "English",
        prefix: "$",
        timezone: "-4" // eastern time by default
    },
    location: {
        city: "",
        state: "",
        country: "USA",
    },
    channels: {
        admin: "",
        log: ""
    },
    roles: {
        admin: "",
        reporter: ""
    },
    migration: {
        tag: false,
        tagrole: "",
        tagchannel: ""
    },
    autoclean: {
        nestreports: false,
        profilecommands: false
    }

    // bots: {
        // miscord: false
    // }
};

module.exports = guildSettings
const defaultNest = {
    name: {
        default: "",
        alias: ""
    },
    serverid: "",
    location: {
        city: "",
        state: "",
        country: "",
        maps: {
            lat: "",
            lon: "",
            google: "",
            osm: "",
            silphroad: ""
        }
    },
    pokestops: "?",
    gyms: "?",
    exgyms: "0",
    spawns: "?",
    pokemon: {
        current: {
            name: "?",
            image: "https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true"
        },
        previous: {
            name: "?",
            image: "https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true"
        }
    },
    messageid: "",
    channelid: "",
    lastReport: {
        date: "",
        time: ""
    },
}

module.exports = defaultNest
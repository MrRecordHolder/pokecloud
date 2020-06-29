const trainerProfile = {
    nickname: "",
    friend_code: "",
    patreon: false,
    report_count: 0,
    // increases by 1 for each report made
    // species can not be the same as the one already nesting (no duplicate reports)
    points: {
        total: 0,
        // profile creation = 50
        // set-friend-code = 35
        // report-nests = 10
        // update-nest = 5
        // create-nests = 10
        // search-nests = 2
        // pokedex = 2
        // farm = 5
        level: 1
        // 1 = 0-100
        // 2 = 101-200
        // 3 = 201-400
        // 4 = 401-800
        // 5 = 401-1600
        // 6 = 1601-3200
        // 7 = 3201-6400
        // 8 = 6401-12800
    },
    farm: [],
    // pokemon to recieve alerts for
    badges: []
    // patreon
    // ...
};

module.exports = trainerProfile
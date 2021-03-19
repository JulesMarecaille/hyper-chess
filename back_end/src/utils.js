const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const config = require("../config.js")

exports.sendOkResponse = (res, object) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(object));
}

exports.dynamicSort = (property) => {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

exports.checkAuth = (connection, token) => {
    const { User } = require("./entities")(connection)
    return new Promise((resolve, reject) => {
        if (!token) {
            reject({ auth: false, message: "No token provided." });
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                reject({ auth: false, message: "Failed to authenticate token." });
            }
            User.findOne({ where: {id: decoded.id}}).then((user) => {
                resolve(user);
            });
        })
    });
}

exports.checkAuthNoDatabase = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject({ auth: false, message: "No token provided." });
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                reject({ auth: false, message: "Failed to authenticate token." });
            }
            resolve();
        });
    });
}


exports.initializeDatabase = async (connection) => {
    // await cleanDatabase(connection)
    // await createBaseUsers(connection)
}

async function cleanDatabase(connection){
    const { User, Deck, Collection } = require("./entities")(connection)
    User.destroy({where: {}})
    Deck.destroy({where: {}})
    Collection.destroy({where: {}})
}

async function createBaseUsers(connection){
    const { User, Deck, Collection } = require("./entities")(connection)
    const salt = bcrypt.genSaltSync(10);

    const jules = User.build({
        "name": "Jules",
        "email": "j@j.j",
        "password": bcrypt.hashSync("jules", salt)
    })

    const octave = User.build({
        "name": "Octave",
        "email": "o@o.o",
        "password": bcrypt.hashSync("octo", salt)
    })

    const deck_jules = Deck.build({
        "name": "Classic Deck",
        "pieces": ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicRook', 'ClassicKnight', 'ClassicBishop', 'ClassicQueen',
                   'ClassicKing', 'ClassicBishop', 'ClassicKnight', 'ClassicRook'],
        "UserId": jules.id
    })

    const deck_octave = Deck.build({
        "name": "Classic Deck",
        "pieces": ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicRook', 'ClassicKnight', 'ClassicBishop', 'ClassicQueen',
                   'ClassicKing', 'ClassicBishop', 'ClassicKnight', 'ClassicRook'],
        "UserId": octave.id
    })

    const collection_octave = Collection.build({
        "ClassicPawn":true,
        "ClassicRook":true,
        "ClassicKnight":true,
        "ClassicKing":true,
        "ClassicBishop":true,
        "ClassicQueen":true,
        "UserId": octave.id
    })

    const collection_jules = Collection.build({
        "ClassicPawn":true,
        "ClassicRook":true,
        "ClassicKnight":true,
        "ClassicKing":true,
        "ClassicBishop":true,
        "ClassicQueen":true,
        "UserId": jules.id
    })
    await jules.save()
    await deck_jules.save()
    await octave.save()
    await deck_octave.save()
    await collection_octave.save()
    await collection_jules.save()
}

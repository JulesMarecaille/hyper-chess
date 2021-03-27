const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const config = require("../config.js");
const nodemailer = require("nodemailer");

function _getFrontEndURL(){
    return "http://localhost:3000";
}

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
    // await createBaseUsers(connection)
}

async function destroyDatabase(connection){
    const { User, Deck, Collection, GameResult, Rewards } = require("./entities")(connection)
    User.destroy({where: {}})
    Deck.destroy({where: {}})
    Collection.destroy({where: {}})
    GameResult.destroy({where: {}})
    Rewards.destroy({where: {}})
}

async function createBaseUsers(connection){
    const { User, Deck, Collection, Rewards } = require("./entities")(connection)
    const salt = bcrypt.genSaltSync(10);

    const jules = User.build({
        "name": "Jules",
        "email": "jules@jules.jules",
        "password": bcrypt.hashSync("jules", salt)
    })

    const octave = User.build({
        "name": "Octave",
        "email": "octo@octo.octo",
        "password": bcrypt.hashSync("octave", salt)
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

    const rewards_jules = Rewards.build({
        "UserId": jules.id
    })
    const rewards_octave = Rewards.build({
        "UserId": octave.id
    })
    await jules.save()
    await deck_jules.save()
    await octave.save()
    await deck_octave.save()
    await collection_octave.save()
    await collection_jules.save()
    await rewards_jules.save()
    await rewards_octave.save()
}

/**********************************************************************
* DATABASE
**********************************************************************/
exports.createDefaultDeck = (connection, user_id) => {
    const { Deck } = require("./entities")(connection)
    return Deck.build({
        "name": "Classic Deck",
        "pieces": ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                   'ClassicRook', 'ClassicKnight', 'ClassicBishop', 'ClassicQueen',
                   'ClassicKing', 'ClassicBishop', 'ClassicKnight', 'ClassicRook'],
        "UserId": user_id
    });
}

exports.createDefaultCollection = (connection, user_id) => {
    const { Collection } = require("./entities")(connection)
    return Collection.build({
        "UserId": user_id
    });
}

exports.createDefaultRewards = (connection, user_id) => {
    const { Rewards } = require("./entities")(connection)
    return Rewards.build({
        "UserId": user_id
    });
}


/**********************************************************************
* EMAILS
**********************************************************************/
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email_user,
        pass: config.email_password,
    },
});

function _sendMail(to, subject, html) {
    const mailOptions = {
        from: "Hyper Chess <contact@hyper-chess.com>",
        to,
        subject,
        html,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}

exports.sendForgotPasswordEmail = (to, reset_password_code) => {
    const link = encodeURI(_getFrontEndURL() + "/reset?reset_token="
                + reset_password_code + "&email=" + to);
    const forgotPasswordEmail = {
        subject: "Reset your password",
        html: '<body style="color:#424242;font-family:\'Lato\',\'LatoRTL\',sans-serif;\
                background-color:#f9f9f9; display:flex; align-items: center">\
                	<div style="margin:40px auto;border: 1.1px solid rgba(0,0,0,0.12);\
                    background-color:#fff;padding:40px 40px 10px 40px;height:auto; min-width: 450px">\
                	<h2 style="color:#1a73e8;">Hello,</h2>\
                	<p> You can click on the button below to reset your password. </p>\
                	<div style="margin: 60px 0; width: 100%; text-align: center;">\
                		<a style="background-color:#1a73e8; border:none; color:#fff; padding: 12px;\
                         border-radius: 4px; font-weight: 600; font-size: 16px; text-decoration: none;"\
                		href="' + link + '">\
                			Reset your password\
                		</a>\
                	</div>\
                	<p style="margin-block-end: 0">Sincerly,</p>\
                	<p style="margin-block-start: 10px;font-size: 15px;\
                     font-weight: 600;color:#1a73e8;">The Hyper Chess Team</p>\
                	<p style="font-size:13px;color:#aaaaaa;width:100%;\
                    text-align: center;margin-top:40px;">\
                     If you did not request that e-mail, ignore it.</p>\
                	</div>\
                </body>',
    };
    return _sendMail(to, forgotPasswordEmail.subject, forgotPasswordEmail.html);
}

exports.sendNewAccountEmail = (to) => {
    const link = encodeURI(_getFrontEndURL() + "/login?email=" + to);
    const newAccountEmail = {
        subject: "Welcome to Hyper Chess!",
        html: '<body style="color:#424242;font-family:\'Lato\',\'LatoRTL\',sans-serif;\
                background-color:#f9f9f9; display:flex; align-items: center">\
                    <div style="margin:40px auto;border-radius: 8px;border: 1.1px solid rgba(0,0,0,0.12);\
                     background-color:#fff;padding:40px 40px 10px 40px;height:auto; min-width: 450px">\
                    <h2 style="color:#1a73e8;">Hello,</h2>\
                    <p>Your Hyper Chess account has been created.</p>\
                    <p>You can log in and start to play right now!</p>\
                    <div style="margin: 60px 0; width: 100%; text-align: center;">\
                    	<a style="background-color:#1a73e8; border:none; color:#fff; padding: 12px;\
                         border-radius: 4px; font-weight: 600; font-size: 16px; text-decoration: none;"\
                    	href="' + link + '">\
                    		Log in\
                    	</a>\
                    </div>\
                    <p style="margin-block-end: 0">Sincerly,</p>\
                    <p style="margin-block-start: 10px;font-size: 15px;\
                     font-weight: 600;color:#1a73e8;">The Hyper Chess Team</p>\
                    </div>\
                </body>',
    };
    return _sendMail(to, newAccountEmail.subject, newAccountEmail.html);
}



/**********************************************************************
* REGEXs
**********************************************************************/
exports.validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.validateUsername = (username) => {
    const re = /^[a-zA-Z\-\_\@0-9]{3,}$/;
    return re.test(String(username).toLowerCase());
}

exports.validatePassword = (password) => {
    const re = /^(.*){5,}$/;
    return re.test(String(password).toLowerCase());
}

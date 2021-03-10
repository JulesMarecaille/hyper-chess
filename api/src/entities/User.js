const { Sequelize, Model, DataTypes } = require('sequelize');
class User extends Model{}
module.exports.User = User
module.exports.initUser = (connection) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },

        create_at:{
            type: DataTypes.DATETIME,
            defaultValue: Sequelize.NOW
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        elo: {
            type: DataTypes.NUMBER,
            allowNull: false
        },

        decks: {

        }
    }, {
        connection,
        modelName: 'user'
    })
}

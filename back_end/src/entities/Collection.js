const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initCollection = (connection) => {
    const Collection = connection.define('Collection', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        // Classic Set
        ClassicKing: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ClassicQueen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ClassicRook: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ClassicBishop: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ClassicKnight: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ClassicPawn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        Unicorn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Phantom: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Elephant: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return Collection;
}

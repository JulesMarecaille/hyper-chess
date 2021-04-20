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
        GuardianPawn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        Archimage: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Empress: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Princess: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        FearfulPawn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        //Plague Set
        PlagueOne: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PlagueThree: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PlagueFive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PlagueNine: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        //Pixel Set
        PixelKing: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PixelQueen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PixelRook: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PixelBishop: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PixelKnight: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PixelPawn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        DragonEgg: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Reaper: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return Collection;
}

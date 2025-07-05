const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Pokemon = sequelize.define("Pokemon", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 50]
            }
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        atk: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        def: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        }
    });

    return Pokemon;
};
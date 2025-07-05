const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PokemonPersonalizado = sequelize.define("PokemonPersonalizado", {
        apodo: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        ev_hp: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        ev_atk: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        ev_def: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        ev_spa: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        ev_spd: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        ev_spe: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 252
            }
        },
        iv_hp: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        },
        iv_atk: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        },
        iv_def: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        },
        iv_spa: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        },
        iv_spd: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        },
        iv_spe: {
            type: DataTypes.INTEGER,
            defaultValue: 31,
            validate: {
                min: 0,
                max: 31
            }
        }
    });

    return PokemonPersonalizado;
};
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PokemonPersonalizado = sequelize.define("PokemonPersonalizado", {
        apodo: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
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
        },
        equipoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        posicion: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            validate: {
                min: 0,
                max: 5
            }
        },
    });

    return PokemonPersonalizado;
};
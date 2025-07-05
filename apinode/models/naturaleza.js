const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Naturaleza = sequelize.define("Naturaleza", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        aumenta: {
            type: DataTypes.ENUM("ataque", "defensa", "ataque_especial", "defensa_especial", "velocidad", "ninguno"),
            allowNull: false
        },
        disminuye: {
            type: DataTypes.ENUM("ataque", "defensa", "ataque_especial", "defensa_especial", "velocidad", "ninguno"),
            allowNull: false
        }
    });

    return Naturaleza;
};
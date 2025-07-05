const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Tipo = sequelize.define("Tipo",{
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        icono: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Tipo;
}
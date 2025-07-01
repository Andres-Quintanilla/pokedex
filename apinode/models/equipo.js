const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Equipo = sequelize.define("Equipo", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        }
    });

    return Equipo;
}
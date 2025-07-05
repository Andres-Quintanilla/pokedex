const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Habilidad = sequelize.define("Habilidad", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1,50]
            }
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        tableName: "Habilidades"
    });

    return Habilidad;
};
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Item = sequelize.define("Item", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 50]
            }
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Item;
};
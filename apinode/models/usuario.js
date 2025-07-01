const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Usuario = sequelize.define("Usuario",{
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        esAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Usuario;
};
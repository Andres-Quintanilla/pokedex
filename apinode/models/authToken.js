const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const AuthToken = sequelize.define("AuthToken",{
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return AuthToken;
};
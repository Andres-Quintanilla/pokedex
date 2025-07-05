const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PokemonMovimiento = sequelize.define("PokemonMovimiento", {
    },{
        timestamps: false,
        tableName: "PokemonMovimientos"
    });
    
    return PokemonMovimiento;
}
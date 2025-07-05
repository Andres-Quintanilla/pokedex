const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const pokemonTipo = sequelize.define("PokemonTipo",{

    },{
        timestamps: false
    });

    return pokemonTipo;
};
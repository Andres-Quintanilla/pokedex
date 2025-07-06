const { sequelize } = require("../config/db.config");

const authToken = require("./authToken")(sequelize);
const equipo = require("./equipo")(sequelize);
const habilidad = require("./habilidad")(sequelize);
const item = require("./item")(sequelize);
const movimiento = require("./movimiento")(sequelize);
const pokemon = require("./pokemon")(sequelize);
const pokemonPersonalizado = require("./pokemonPersonalizado")(sequelize);
const usuario = require("./usuario")(sequelize);
const tipo = require("./tipo")(sequelize);
const pokemonMovimiento = require("./pokemonMovimiento")(sequelize);
const pokemonTipo = require("./pokemonTipo")(sequelize);
const naturaleza = require("./naturaleza")(sequelize);

usuario.hasMany(authToken, { foreignKey: "usuarioId"});
authToken.belongsTo(usuario, { foreignKey: "usuarioId"});

usuario.hasMany(equipo, { foreignKey: "usuarioId"});
equipo.belongsTo(usuario, { foreignKey: "usuarioId"});

equipo.hasMany(pokemonPersonalizado, { foreignKey: "equipoId", as: "pokemonesPersonalizados"});
pokemonPersonalizado.belongsTo(equipo, { foreignKey: "equipoId", as: "equipo"});

pokemon.hasMany(pokemonPersonalizado, { foreignKey: "pokemonId", as: "pokemonesPersonalizados"});
pokemonPersonalizado.belongsTo(pokemon, { foreignKey: "pokemonId", as: "pokemon"});

habilidad.hasMany(pokemonPersonalizado, { foreignKey: "habilidadId"});
pokemonPersonalizado.belongsTo(habilidad, { foreignKey: "habilidadId"});

item.hasMany(pokemonPersonalizado, { foreignKey: "itemId"});
pokemonPersonalizado.belongsTo(item, { foreignKey: "itemId"});

movimiento.belongsToMany(pokemonPersonalizado, { through: pokemonMovimiento, foreignKey: "movimientoId"});
pokemonPersonalizado.belongsToMany(movimiento, { through: pokemonMovimiento, foreignKey: "pokemonPersonalizadoId"});

pokemon.belongsToMany(tipo, { through: pokemonTipo, foreignKey: "pokemonId"});
tipo.belongsToMany(pokemon, { through: pokemonTipo, foreignKey: "tipoId"});

pokemon.belongsToMany(habilidad, { through: "pokemon_habilidades", foreignKey: "pokemonId", as: "habilidades" });
habilidad.belongsToMany(pokemon, { through: "pokemon_habilidades", foreignKey: "habilidadId"});

pokemonPersonalizado.belongsTo(naturaleza, { foreignKey: "naturalezaId", as: "naturaleza" });
naturaleza.hasMany(pokemonPersonalizado, { foreignKey: "naturalezaId", as: "pokemonesPersonalizados" });

module.exports = {
    authToken,
    equipo,
    habilidad,
    item,
    movimiento,
    pokemon,
    pokemonPersonalizado,
    usuario,
    pokemonMovimiento,
    pokemonTipo,
    naturaleza,
    sequelize,
    Sequelize: sequelize.Sequelize
};
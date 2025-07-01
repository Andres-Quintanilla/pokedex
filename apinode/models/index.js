const { sequelize } = require("../config/db.config");

const authToken = require("./authToken")(sequelize);
const equipo = require("./equipo")(sequelize);
const habilidad = require("./habilidad")(sequelize);
const item = require("./item")(sequelize);
const movimiento = require("./movimiento")(sequelize);
const pokemon = require("./pokemon")(sequelize);
const pokemonPersonalizado = require("./pokemonPersonalizado")(sequelize);
const usuario = require("./usuario")(sequelize);
const pokemonMovimiento = require("./pokemonMovimiento")(sequelize);

usuario.hasMany(authToken, { foreignKey: "usuarioId"});
authToken.belongsTo(usuario, { foreignKey: "usuarioId"});

usuario.hasMany(equipo, { foreignKey: "usuarioId"});
equipo.belongsTo(usuario, { foreignKey: "usuarioId"});

equipo.hasMany(pokemonPersonalizado, { foreignKey: "equipoId"});
pokemonPersonalizado.belongsTo(equipo, { foreignKey: "equipoId"});

pokemon.hasMany(pokemonPersonalizado, { foreignKey: "pokemonId"});
pokemonPersonalizado.belongsTo(pokemon, { foreignKey: "pokemonId"});

habilidad.hasMany(pokemonPersonalizado, { foreignKey: "habilidadId"});
pokemonPersonalizado.belongsTo(habilidad, { foreignKey: "habilidadId"});

item.hasMany(pokemonPersonalizado, { foreignKey: "itemId"});
pokemonPersonalizado.belongsTo(item, { foreignKey: "itemId"});

movimiento.belongsToMany(pokemonPersonalizado, { through: pokemonMovimiento, foreignKey: "movimientoId"});
pokemonPersonalizado.belongsToMany(movimiento, { through: pokemonMovimiento, foreignKey: "pokemonPersonalizadoId"});

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
    sequelize,
    Sequelize: sequelize.Sequelize
};
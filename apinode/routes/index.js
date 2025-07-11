module.exports = app => {
    require("./auth.routes")(app);
    require("./usuario.routes")(app);
    require("./pokemon.routes")(app);
    require("./equipo.routes")(app);
    require("./item.routes")(app);
    require("./habilidad.routes")(app);
    require("./movimiento.routes")(app);
    require("./tipo.routes")(app);
    require("./pokemonPersonalizado.routes")(app);
    require("./naturaleza.routes")(app);
}
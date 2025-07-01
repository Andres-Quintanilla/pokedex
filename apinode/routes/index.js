module.exports = app => {
    require("./auth.routes")(app);
    require("./usuario.routes")(app);
    require("./pokemon.routes")(app);
}
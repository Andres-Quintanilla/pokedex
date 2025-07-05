module.exports = app => {
    const router = require("express").Router();
    const pokemonPersonalizadoController = require("../controller/pokemonPersonalizado.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.get("/", requireUser, pokemonPersonalizadoController.listar);
    router.get("/:id", requireUser, pokemonPersonalizadoController.obtenerPorId);
    router.post("/", requireUser, pokemonPersonalizadoController.crear);
    router.put("/:id", requireUser, pokemonPersonalizadoController.actualizarTodo);
    router.patch("/:id", requireUser, pokemonPersonalizadoController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, pokemonPersonalizadoController.eliminar);
    app.use("/pokemon-personalizado", router);
};
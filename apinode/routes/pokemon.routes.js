module.exports = app => {
    const router = require("express").Router();
    const pokemonController = require("../controller/pokemon.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin  } = require("../middlewares/requires-admin");

    router.get("/", requireUser, pokemonController.listar);
    router.get("/:id", requireUser, pokemonController.obtenerPorId);
    router.post("/", requireUser, requireAdmin, pokemonController.crear);
    router.put("/:id", requireUser, requireAdmin, pokemonController.actualizarTodo);
    router.patch("/:id", requireUser, requireAdmin, pokemonController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, requireAdmin, pokemonController.eliminar);
    router.get("/:id/movimientos", requireUser ,pokemonController.obtenerMovimientosPorPokemon);
    router.get("/:id/habilidades", requireUser ,pokemonController.obtenerHabilidadesPorPokemon);
    router.post("/:id/habilidades", requireUser, requireAdmin, pokemonController.asignarHabilidades);
    router.post("/:id/movimientos", requireUser, requireAdmin, pokemonController.asignarMovimientos);
    router.get("/:id/tipos", requireUser, pokemonController.obtenerTiposPorPokemon);
    router.post("/:id/tipos", requireUser, requireAdmin, pokemonController.asignarTipos);
    app.use("/pokemones", router);
};

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
    app.use("/pokemones", router);
};

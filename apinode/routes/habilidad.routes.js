module.exports = app => {
    const router = require("express").Router();
    const habilidadController = require("../controller/habilidad.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin")

    router.get("/", requireUser, habilidadController.listar);
    router.get("/:id", requireUser, habilidadController.obtenerPorId);
    router.post("/", requireUser, requireAdmin, habilidadController.crear);
    router.put("/:id", requireUser, requireAdmin, habilidadController.actualizarTodo);
    router.patch("/:id", requireUser, requireAdmin, habilidadController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, requireAdmin, habilidadController.eliminar);
    app.use("/habilidades", router);
};
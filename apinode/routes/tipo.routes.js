module.exports = app => {
    const router = require("express").Router();
    const tipoController = require("../controller/tipo.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");

    router.get("/", requireUser, tipoController.listar);
    router.get("/:id", requireUser, tipoController.obtenerPorId);
    router.post("/", requireUser, requireAdmin, tipoController.crear);
    router.put("/:id", requireUser, requireAdmin, tipoController.actualizarTodo);
    router.patch("/:id", requireUser, requireAdmin, tipoController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, requireAdmin, tipoController.eliminar);
    app.use("/tipos", router);
};
module.exports = app => {
    const router = require("express").Router();
    const movimientoController = require("../controller/movimiento.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");

    router.get("/", requireUser, movimientoController.listar);
    router.get("/:id", requireUser, movimientoController.obtenerPorId);
    router.post("/", requireUser, requireAdmin, movimientoController.crear);
    router.put("/:id", requireUser, requireAdmin, movimientoController.actualizarTodo);
    router.patch("/:id", requireUser, requireAdmin, movimientoController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, requireAdmin, movimientoController.eliminar);
    app.use("/movimientos", router);
};
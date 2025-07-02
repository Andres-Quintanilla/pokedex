module.exports = app => {
    const router = require("express").Router();
    const itemController = require("../controller/item.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");

    router.get("/", requireUser, itemController.listar);
    router.get("/:id", requireUser, itemController.obtenerPorId);
    router.post("/", requireUser, requireAdmin, itemController.crear);
    router.put("/:id", requireUser, requireAdmin, itemController.actualizarTodo);
    router.patch("/:id", requireUser, requireAdmin, itemController.actualizarUnoPorUno);
    router.delete("/:id", requireUser, requireAdmin, itemController.eliminar);
    app.use("/items", router);
};
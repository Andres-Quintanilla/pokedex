module.exports = app => {
    const router = require("express").Router();
    const usuarioController = require("../controller/usuario.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");

    router.get("/", requireUser, requireAdmin, usuarioController.listarUsuarios);
    router.put("/:id/hacer-admin", requireUser, requireAdmin, usuarioController.hacerAdmin);
    router.put("/:id/quitar-admin", requireUser, requireAdmin, usuarioController.quitarAdmin);
    router.put("/:id/cambiar-password", requireUser, requireAdmin, usuarioController.cambiarPassword);
    app.use("/usuarios", router);
};
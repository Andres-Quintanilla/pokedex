module.exports = app => {
    const router = require("express").Router();
    const naturalezaController = require("../controller/naturaleza.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.get("/", requireUser, naturalezaController.listar);
    router.get("/:id", requireUser , naturalezaController.obtenerPorId);
    app.use("/naturalezas", router);
};
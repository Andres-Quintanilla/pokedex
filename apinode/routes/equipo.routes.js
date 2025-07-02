module.exports = app => {
    const router = require("express").Router();
    const equipoController = require("../controller/equipo.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.post("/", requireUser, equipoController.crear);
    router.get("/", requireUser, equipoController.listar);
    app.use("equipos", router);

};
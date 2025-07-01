module.exports = app => {
    const router = require("express").Router();
    const authController = require("../controller/auth.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.post("/login", authController.login);
    router.post("/registro", authController.register);
    router.get("/me", requireUser, authController.me);
    app.use("/auth", router);
};
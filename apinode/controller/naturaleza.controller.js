const db = require("../models");

exports.listar = async (req, res) => {
    try {
        const naturalezas = await db.naturaleza.findAll();
        res.json(naturalezas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las naturalezas" });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const naturaleza = await db.naturaleza.findByPk(req.params.id);
        if (!naturaleza) {
            return res.status(404).json({ message: "Naturaleza no encontrada" });
        }
        res.json(naturaleza);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al buscar la naturaleza" });
    }
};

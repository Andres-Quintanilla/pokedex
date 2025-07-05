const db = require("../models");

exports.listar = async (req, res) => {
    try {
        const tipo = await db.tipo.findAll();
        res.status(200).send(tipo);
    } catch (error) {
        res.status(500).send({message: "Error al obtener los tipo"});
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await db.tipo.findByPk(id);

        if(!tipo) {
            return res.status(404).send({message: "Tipo no encontrado"});
        }

        res.status(200).send(tipo);
    } catch (error) {
        res.status(500).send({message: "Error al buscar el tipo"});
    }
};

exports.crear = async (req, res) => {
    try {
        const { nombre, icono } = req.body;

        if(!nombre) {
            return res.status(400).send({message: "El nombre del tipo es obligatorio"});
        }

        const existente = await db.tipo.findOne({
            where: {
                nombre
            }
        });

        if(existente){
            return res.status(400).send({message: "Ya existe un tipo con ese nombre"});
        }
        
        const nuevoTipo = await db.tipo.create({ nombre, icono });
        res.status(201).send(nuevoTipo);
    } catch (error) {
        res.status(500).send({message: "Error al crear el tipo"});
    }
};

exports.actualizarTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, icono } = req.body;

        const tipo = await db.tipo.findByPk(id);

        if(!tipo){
            return res.status(404).send({message: "Tipo no encontrado"});
        }

        await tipo.update({ nombre, icono });
        res.status(200).send(tipo);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar el tipo"});
    }
};

exports.actualizarUnoPorUno = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, icono } = req.body;

        const tipo = await db.tipo.findByPk(id);

        if(!tipo){
            return res.status(404).send({message: "Tipo no encontrado"});
        }

        if(nombre){
            tipo.nombre = nombre;
        }

        if(icono){
            tipo.icono = icono;
        }

        await tipo.save();
        res.status(200).send(tipo);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar el tipo"});
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const tipo = await db.tipo.findByPk(id);

        if(!tipo) {
            return res.status(404).send({message: "Tipo no encontrado"});
        }

        await tipo.destroy();
        res.status(200).send({message: "Tipo eliminado con éxito"});
    } catch (error) {
        res.status(500).send({message: "Error al eliminar el tipo"});
    }
};
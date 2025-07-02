const { where } = require("sequelize");
const db = require("../models");

const validarHabilidad = (body) => {
    const errores = {};

    if(!body.nombre || body.nombre.length < 1 || body.nombre.length >= 50){
        errores.nombre = "El nombre es obligatorio y debe tener entre 1 y 50 caracteres";
    }

    return Object.keys(errores).length > 0 ? errores : null;
};

exports.listar = async (req, res) => {
    try {
        const habilidades = await db.habilidad.findAll();
        res.send(habilidades);
    } catch (error) {
        res.status(500).send({message: "Error al obtener las habilidades"});
    }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const habilidad = await db.habilidad.findByPk(id);

        if(!habilidad){
            return res.status(404).send({message: "Habilidad no encontrada"});
        }

        res.send(habilidad);
    } catch (error) {
        res.status(500).send({ message: "Error al buscar la habilidad" });
    }
};

exports.crear = async (req, res) => {
    const datos = req.body;
    const errores = validarHabilidad(datos);

    if(errores){
        return res.status(400).send(errores);
    }

    const existente = await db.habilidad.findOne({
        where: {
            nombre: datos.nombre
        }
    })

    if(existente){
        return res.status(400).send({message: "Ya existe una habilidad con ese nombre"});
    }

    try {
        const nuevaHabilidad = await db.habilidad.create(datos);
        res.status(201).send(nuevaHabilidad);
    } catch (error) {
        res.status(500).send({message: "Error al crear la habilidad"});
    }
};

exports.actualizarTodo = async (req, res)  => {
    const { id } = req.params;
    const datos = req.body;

    const habilidad = await db.habilidad.findByPk(id);

    if(!habilidad){
        return res.status(404).send({message: "Habilidad no encontrada"});
    }

    const errores = validarHabilidad(datos);

    if(errores){
        return res.status(400).send(errores);
    }

    try {
        await habilidad.update(datos);
        res.send(habilidad);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar la habilidad"});
    }
};

exports.actualizarUnoPorUno = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const habilidad = await db.habilidad.findByPk(id);

    if(!habilidad){
        return res.status(404).send({message: "Habilidad no encontrada"});
    }

    const errores = {};

    if(body.nombre && (body.nombre.length < 1 || body.nombre.length >= 50)){
        errores.nombre = "El nombre debe tener entre 1 y 50 caracteres";
    }

    if(Object.keys(errores).length > 0){
        return res.status(400).send(errores);
    }

    const campos = ["nombre", "descripcion"];

    for (const campo of campos){
        if(body[campo] !== undefined){
            habilidad[campo] = body[campo];
        }
    }

    try {
        await habilidad.save();
        res.send(habilidad);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar la habilidad"});
    }
};

exports.eliminar = async (req, res) => {
    const { id } = req.params;

    const habilidad = await db.habilidad.findByPk(id);

    if(!habilidad){
        return res.status(404).send({message: "Habilidad no encontrada"});
    }

    try {
        await habilidad.destroy();
        res.status(204).send({message: "Habilidad eliminada correctamente"});
    } catch (error) {
        res.status(500).send({message: "Error al eliminar la habilidad"});
    }
}
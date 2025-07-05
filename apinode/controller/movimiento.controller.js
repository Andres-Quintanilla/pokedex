const db = require("../models");

const TIPOS_VALIDOS = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
    'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
    'Siniestro', 'Tierra', 'Veneno', 'Volador'
]; 

const validarMovimiento = (body) => {
    const errores = {};

    if(!body.nombre || body.nombre.length < 1 || body.nombre.length > 50){
        errores.nombre = "El nombre es obligatorio y debe tener entre 1 y 50 caracteres";
    }

    if(!body.tipo || !TIPOS_VALIDOS.includes(body.tipo)){
        errores.tipo = "El tipo es obligatorio y debe ser uno de los tipos válidos";
    }

    if(body.potencia !== null && body.potencia !== undefined){
        if(isNaN(body.potencia) || body.potencia < 1 || body.potencia > 250){
            errores.potencia = "La potencia debe ser un número entre 1 y 250";
        }
    }

    if(body.precision !== null && body.precision !== undefined){
        if(isNaN(body.precision) || body.precision < 1 || body.precision > 100){
            errores.precision = "La precisión debe ser un número entre 1 y 100";
        }
    }

    return Object.keys(errores).length > 0 ? errores : null;
};

exports.listar = async (req, res) => {
    try {
        const movimiento = await db.movimiento.findAll();
        res.send(movimiento);
    } catch (error) {
        res.status(500).send({message: "Error al obtener los movimientos"})
    }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const movimiento = await db.movimiento.findByPk(id);

        if(!movimiento) {
            return res.status(404).send({message: "Movimiento no encontrado"});
        }

        res.send(movimiento);
    } catch (error) {
        res.status(500).send({message: "Error al buscar el movimiento"});
    }
};

exports.crear = async (req, res) => {
    const datos = req.body;

    const errores = validarMovimiento(datos);

    if(errores) {
        return res.status(400).send(errores);
    }

    const existente = await db.movimiento.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if(existente) {
        return res.status(400).send({
            nombre: "Ya existe un movimiento con ese nombre"
        });
    }

    try {
        const nuevoMovimiento = await db.movimiento.create(datos);
        res.status(201).send(nuevoMovimiento);
    } catch (error) {
        res.status(500).send({message: "Error al crear el movimiento"});
    }
};

exports.actualizarTodo = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;

    const movimiento = await db.movimiento.findByPk(id);

    if(!movimiento){
        return res.status(404).send({message: "Movimiento no encontrado"});
    }

    const errores = validarMovimiento(datos);

    if(errores){
        return res.status(400).send(errores);
    }

    try {
        await movimiento.update(datos);
        res.send(movimiento);
    } catch (error) {
        res.status(500).send({message: "Erro al actualizar el movimiento"});
    }
};

exports.actualizarUnoPorUno = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const movimiento = await db.movimiento.findByPk(id);

    if(!movimiento) {
        return res.status(404).send({message: "Movimiento no encontrado"});
    }

    const errores = {};

    if(body.nombre && (body.nombre.length < 1 || body.nombre.length > 50)){
        errores.nombre = "El nombre debe tener entre 1 y 50 caracteres";
    }

    if(body.tipo && !TIPOS_VALIDOS.includes(body.tipo)){
        errores.tipo = "Tipo inválido";
    }

    if (body.potencia !== undefined) {
        if (isNaN(body.potencia) || body.potencia < 1 || body.potencia > 250) {
            errores.potencia = "La potencia debe ser un número entre 1 y 250";
        }
    }

    if (body.precision !== undefined) {
        if (isNaN(body.precision) || body.precision < 1 || body.precision > 100) {
            errores.precision = "La precisión debe ser un número entre 1 y 100";
        }
    }

    if(Object.keys(errores).length > 0){
        return res.status(400).send(errores);
    }

    try {
        const campos = ['nombre', 'tipo', 'potencia', 'precision'];
        for (const campo of campos){
            if(body[campo] !== undefined){
                movimiento[campo] = body[campo];
            }
        }

        await movimiento.save();
        res.send(movimiento);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar el movimiento"});
    }
};

exports.eliminar = async (req, res) => {
    const { id } = req.params;

    const movimiento = await db.movimiento.findByPk(id);

    if(!movimiento){
        return res.status(404).send({message: "Movimiento no encontrado"});
    }

    try {
        await movimiento.destroy();
        res.status(204).send({message: "Movimiento eliminado con éxito"});
    } catch (error) {
        res.status(500).send({message: "Error al eliminar el movimiento"});
    }
};
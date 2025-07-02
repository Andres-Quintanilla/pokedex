const db = require("../models");
const path = require("path");
const fs = require("fs");

const validarItem = (body) => {
    const errores = {};

    if(!body.nombre || body.nombre.length < 1 || body.nombre.length >= 50){
        errores.nombre = "El nombre es obligatorio y debe tener entre 1 y 50 caracteres";
    }

    if(!body.imagen){
        errores.imagen = "La ruta de la imagen es obligatoria";
    }

    return Object.keys(errores).length > 0 ? errores : null;
};

exports.listar = async (req, res) => {
    try {
        const items = await db.item.findAll();
        res.send(items);
    } catch (error) {
        res.status(500).send({message: "Error al obtener los items"});
    }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await db.item.findByPk(id);

        if(!item){
            return res.status(404).send({message: "Item no encontrado"});
        }

        res.send(item);
    } catch (error){
        res.status(500).send({message: "Error al buscar el item"});
    }
};

exports.crear = async (req, res) => {
    const datos = req.body;
    const errores = validarItem(datos);

    if(errores){
        return res.status(400).send(errores);
    }

    const existente = await db.item.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if(existente){
        return res.status(400).send({message: "Ya existe un item con ese nombre"});
    }

    const rutaOrigen = datos.imagen;
    if (!fs.existsSync(rutaOrigen)) {
        return res.status(400).send({ imagen: "La ruta de imagen no existe en tu sistema" });
    }

    try {
        const extension = path.extname(rutaOrigen);
        const nombreArchivo = `${datos.nombre.toLowerCase().replace(/\s+/g, "_")}${extension}`;
        const rutaDestino = path.join(__dirname, "..", "uploads", nombreArchivo);
        const rutaRelativa = `/uploads/${nombreArchivo}`;    
        
        fs.copyFileSync(rutaOrigen, rutaDestino);

        datos.imagen = rutaRelativa;

        const nuevoItem = await db.item.create(datos);
        res.status(201).send(nuevoItem);
    } catch (error) {
        res.status(500).send({message: "Error al crear el item"});
    }
};

exports.actualizarTodo = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;
    const file = req.files?.imagen;

    const item = await db.item.findByPk(id);

    if(!item) {
        return res.status(404).send({message: "Item no encontrado"});
    }

    const errores = validarItem({ ...datos, imagen: file ? "dummy" : item.imagen });
    
    if (errores) {
        return res.status(400).send(errores);
    }

    if(file){
        const extension = path.extname(file.name);
        const nombreArchivo = `${datos.nombre?.toLowerCase().replace(/\s+/g, "_") || item.nombre.toLowerCase()}.${extension}`;
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        const rutaAbsoluta = path.join(__dirname, "..", "uploads", nombreArchivo);  
        
        try {
            await file.mv(rutaAbsoluta);
            datos.imagen = rutaRelativa;
        } catch (error) {
            return res.status(500).send({message: "Error al guardar la imagen"});
        }
    } else if (datos.imagen && fs.existsSync(datos.imagen)){
        const extension = path.extname(datos.imagen);
        const nombreArchivo = `${(datos.nombre || item.nombre).toLowerCase().replace(/\s+/g, "_")}${extension}`;
        const rutaDestino = path.join(__dirname, "..", "uploads", nombreArchivo);
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        
        try {
            fs.copyFileSync(datos.imagen, rutaDestino);
            datos.imagen = rutaRelativa;
        } catch (error) {
            return res.status(500).send({message: "Error al copiar la imagen"});
        }
    }

    try {
        await item.update({...datos, imagen: datos.imagen || item.imagen});
        res.send(item);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar el item"});
    }
};

exports.actualizarUnoPorUno = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const file = req.files?.imagen;

    const item = await db.item.findByPk(id);

    if(!item){
        return res.status(404).send({message: "Item no econtrado"});
    }

    const errores = {};

    if(body.nombre && (body.nombre.length < 1 || body.nombre.length >= 50)){
        errores.nombre = "El nombre debe tener entre 1 y 50 caracteres";
    }

    if(Object.keys(errores).length > 0 ){
        return res.status(400).send(errores);
    }

    if(file){
        const extension = path.extname(file.name);
        const nombreArchivo = `${(body.nombre || item.nombre).toLowerCase().replace(/\s+/g, "_")}${extension}`;
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        const rutaAbsoluta = path.join(__dirname, "..", "uploads", nombreArchivo);

        try {
            await file.mv(rutaAbsoluta);
            item.imagen  = rutaRelativa;
        } catch (error) {
            return res.status(500).send({message: "Error al guardad la imagen"});
        }

    } else if (body.imagen && fs.existsSync(body.imagen)) {
        const extension = path.extname(body.imagen);
        const nombreArchivo = `${(body.nombre || item.nombre).toLowerCase().replace(/\s+/g, "_")}${extension}`;
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        const rutaAbsoluta = path.join(__dirname, "..", "uploads", nombreArchivo);

        try {
            fs.copyFileSync(body.imagen, rutaAbsoluta);
            item.imagen = rutaRelativa;
        } catch (error) {
            return res.status(500).send({ message: "Error al copiar la imagen desde ruta local" });
        }
    }

    const campos = ['nombre', 'descripcion'];
    
    for(const campo of campos) {
        if (body[campo] !== undefined){
            item[campo] = body[campo];
        }
    }

    try {
        await item.save();
        res.send(item);
    } catch (error) {
        res.status(500).send({message: "Error al actualizar el item"});
    }
};

exports.eliminar = async (req, res) => {
    const { id } = req.params;

    const item = await db.item.findByPk(id);

    if(!item) {
        return res.status(404).send({message: "Item no encontrado"});
    }

    try {
        await item.destroy();
        res.status(204).send({message: "Item eliminado correctamente"});
    } catch (error) {
        res.status(500).send({message: "Error al eliminar el item"});
    }
};
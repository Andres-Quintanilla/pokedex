const db = require("../models");
const path = require("path");
const fs = require("fs");

const TIPOS_VALIDOS = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
    'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
    'Siniestro', 'Tierra', 'Veneno', 'Volador'
]; 

const validarPokemon = (body) => {
    const errores = {};
    const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

    if(!body.nombre || body.nombre.length < 1 || body.nombre.length >= 50){
        errores.nombre = "El nombre es obligatorio y debe tener entre 1 a 50 caracteres"
    }

    if(!body.imagen){
        errores.imagen = "La imagen es obligatoria";
    }

    if(!TIPOS_VALIDOS.includes(body.tipo1)){
        errores.tipo1 = "El tipo1 del pokemon es inválido";
    }

    if(body.tipo2 && !TIPOS_VALIDOS.includes(body.tipo2)){
        errores.tipo2 = "El tipo2 del pokemon es inválido";
    }

    for (const stat of stats){
        const valor = body[stat];
        if (valor === undefined || valor < 1 || valor >= 255){
            errores[stat] = `El campo ${stat} debe estar entre 1 y 255`;
        }
    }

    return Object.keys(errores).length > 0 ? errores : null;
};

exports.listar = async (req, res) => {
    try{
        const pokemones = await db.pokemon.findAll({
        include: {
            model: db.tipo,
            through: { attributes: [] }
        }
        });
        res.send(pokemones)
    }catch (error){
        res.status(500).send({message: "Error al obtener los Pokemones"});
    }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try{
        const pokemon = await db.pokemon.findByPk(id);
        
        if(!pokemon){
            return res.status(404).send({message: "Pokemon no encontrado"});
        }

        res.send(pokemon);
    }catch (error){
        res.status(500).send({message: "Error al buscar el Pokemon"});
    }
};

exports.crear = async (req, res) => {
    const datos = req.body;

    const errores = validarPokemon(datos);
    if (errores) return res.status(400).send(errores);

    const existente = await db.pokemon.findOne({ where: { nombre: datos.nombre } });
    if (existente) {
        return res.status(400).send({ nombre: "Ya existe un Pokémon con ese nombre" });
    }

    const rutaOrigen = datos.imagen;
    if (!fs.existsSync(rutaOrigen)) {
        return res.status(400).send({ imagen: "La ruta de la imagen no existe" });
    }

    try {
        const extension = path.extname(rutaOrigen);
        const nombreArchivo = `${datos.nombre.toLowerCase().replace(/\s+/g, "_")}${extension}`;
        const rutaDestino = path.join(__dirname, "..", "uploads", nombreArchivo);
        const rutaRelativa = `/uploads/${nombreArchivo}`;

        fs.copyFileSync(rutaOrigen, rutaDestino);

        datos.imagen = rutaRelativa;

        const nuevoPokemon = await db.pokemon.create(datos);
        res.status(201).send(nuevoPokemon);
    } catch (error) {
        console.error("ERROR al copiar imagen:", error);
        res.status(500).send({ message: "Error al crear el Pokemon", error });
    }
};


exports.actualizarTodo = async (req, res) => {
    const { id } = req.params;
    const file = req.files?.imagen;
    const datos = req.body;

    const existente = await db.pokemon.findByPk(id);

    if(!existente){
        return res.status(404).send({message: "Pokemon no encontrado"});
    }

    const errores = validarPokemon({ ...datos, imagen: file ? "dummy" : existente.imagen});

    if(errores){
        return res.status(400).send(errores);
    }

    if(file){
        const existente = file.name.split('.').pop();
        const nombreArchivo = `${datos.nombre?.toLowerCase().replace(/\s+/g, "_") || existente.nombre.toLowerCase()}.${extension}`;
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        const rutaAbsoluta = path.join(__dirname, "..", "uploads", nombreArchivo);

        try {
            await file.mv(rutaAbsoluta);
            datos.imagen = rutaRelativa;
        } catch (error) {
            return res.status(500).send({ message: "Error al guardar la imagen", error });
        }
    }

    try{
        await existente.update({ ...datos, imagen: datos.imagen || existente.imagen});
        res.send(existente);
    }catch (error){
        res.status(500).send({message: "Error al actualizar el Pokemon"});
    }
    
};

exports.actualizarUnoPorUno = async (req, res) => {
    const { id } = req.params;
    const file = req.file?.imagen;
    const body = req.body;

    const existente = await db.pokemon.findByPk(id);

    if (!existente) {
        return res.status(404).send({ message: "Pokemon no encontrado" });
    }

    const errores = {}; 

    if (body.nombre && (body.nombre.length < 1 || body.nombre.length >= 50)) {
        errores.nombre = "El nombre debe tener entre 1 y 50 caracteres";
    }

    if (body.tipo1 && !TIPOS_VALIDOS.includes(body.tipo1)) {
        errores.tipo1 = "El tipo1 es inválido";
    }

    if (body.tipo2 && !TIPOS_VALIDOS.includes(body.tipo2)) {
        errores.tipo2 = "El tipo2 es inválido";
    }

    for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe']) {
        if (body[stat] !== undefined) {
            const valor = body[stat];
            if (valor < 1 || valor >= 255) {
                errores[stat] = `El campo ${stat} debe estar entre 1 y 255`;
            }
        }
    }

    if (Object.keys(errores).length > 0) {
        return res.status(400).send(errores);
    }

    if(file){
        const extension = file.name.split('.').pop();
        const nombreArchivo = `${(body.nombre || existente.nombre).toLowerCase().replace(/\s+/g, "_")}.${extension}`;
        const rutaRelativa = `/uploads/${nombreArchivo}`;
        const rutaAbsoluta = path.join(__dirname, "..", "uploads", nombreArchivo);

        try {
            await file.mv(rutaAbsoluta);
            existente.imagen = rutaRelativa;
        } catch (error) {
            return res.status(500).send({ message: "Error al guardar la imagen", error });
        }
    }

    const camposValidos = ['nombre', 'imagen', 'tipo1', 'tipo2', 'hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    
    for (const campo of camposValidos) {
            if (body[campo] !== undefined) {
                existente[campo] = body[campo];
            }
        }

    try {
        await existente.save();
        res.send(existente);
    } catch (error) {
        res.status(500).send({ message: "Error al actualizar el Pokémon" });
    }
};


exports.eliminar = async (req, res) => {
    const { id } = req.params;

    const existente = await db.pokemon.findByPk(id);

    if(!existente){
        return res.status(404).send({message: "Pokemon no encontrado"});
    }

    try {
        await existente.destroy();
        res.status(204).send({message: "Pokemon eliminado con exito"});
    }catch (error){
        res.status(500).send({message: "Error al eliminar el Pokemon"})
    }
};

exports.obtenerMovimientosPorPokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await db.pokemon.findByPk(id, {
            include: {
                model: db.movimiento,
                through: { attributes: [] },
                include: {
                    model: db.tipo,
                    attributes: ["id", "nombre", "color"]
                }
            }
        });

        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        res.json(pokemon.movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener movimientos del Pokémon" });
    }
};

exports.asignarMovimientos = async (req, res) => {
    const { id } = req.params;
    const { movimientos } = req.body; 

    if (!Array.isArray(movimientos) || movimientos.length === 0) {
        return res.status(400).json({ message: "Debes enviar un arreglo de IDs de movimientos válidos." });
    }

    try {
        const pokemon = await db.pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado." });
        }

        const movimientosExistentes = await db.movimiento.findAll({
            where: { id: movimientos }
        });

        if (movimientosExistentes.length !== movimientos.length) {
            return res.status(400).json({ message: "Uno o más IDs de movimientos no son válidos." });
        }

        await pokemon.setMovimientos(movimientos); 

        res.status(200).json({ message: "Movimientos asignados correctamente al Pokémon." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar movimientos al Pokémon." });
    }
};


exports.obtenerHabilidadesPorPokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await db.pokemon.findByPk(id, {
            include: {
                model: db.habilidad,
                as: "habilidades",
                through: { attributes: [] }
            }
        });

        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        res.json(pokemon.habilidades); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener habilidades del Pokémon" });
    }
};

exports.asignarHabilidades = async (req, res) => {
    const { id } = req.params;
    const { habilidades } = req.body; 

    if (!Array.isArray(habilidades) || habilidades.length === 0) {
        return res.status(400).json({ message: "Debes enviar un arreglo de IDs de habilidades válidas." });
    }

    try {
        const pokemon = await db.pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado." });
        }

        const habilidadesExistentes = await db.habilidad.findAll({
            where: { id: habilidades }
        });

        if (habilidadesExistentes.length !== habilidades.length) {
            return res.status(400).json({ message: "Uno o más IDs de habilidades no son válidos." });
        }

        await pokemon.setHabilidades(habilidades);

        res.status(200).json({ message: "Habilidades asignadas correctamente al Pokémon." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar habilidades al Pokémon." });
    }
};

exports.obtenerTiposPorPokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await db.pokemon.findByPk(id, {
            include: {
                model: db.tipo,
                through: { attributes: [] }
            }
        });

        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        res.json(pokemon.tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los tipos del Pokémon" });
    }
};

exports.asignarTipos = async (req, res) => {
    const { id } = req.params;
    const { tipo1, tipo2 } = req.body;

    try {
        const pokemon = await db.pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        const tipos = await db.tipo.findAll({
            where: {
                nombre: [tipo1, tipo2].filter(Boolean)
            }
        });

        if (tipos.length === 0) {
            return res.status(400).json({ message: "Los tipos proporcionados no son válidos" });
        }

        await pokemon.setTipos(tipos);
        res.json({ message: "Tipos asignados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar tipos al Pokémon" });
    }
};

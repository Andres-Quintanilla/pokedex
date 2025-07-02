const db = require("../models");

exports.crear = async (req, res) => {
    const { nombre } = req.body;
    const usuarioId = res.locals.usuario.id;

    if(!nombre || nombre.length < 1 || nombre.length >= 50){
        return res.status(400).send({nombre: "El nombre del equipo debe tener entre 1 y 50 caracteres"});
    }

    try{
        const nuevoEquipo = await db.equipo.create({
            nombre,
            usuarioId
        });

        res.status(200).send(nuevoEquipo);
    } catch (error){
        res.status(500).send({message: "Error al crear el equipo"});
    }
};

exports.listar  = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    try {
        const equipos = await db.equipo.findAll({
            where : { usuarioId },
            include: {
                model: db.pokemonPersonalizado,
                include: [
                    {
                        model: db.pokemon, attributes: ['nombre', 'imagen', 'tipo1', 'tipo2']
                    }
                ]
            }
        });

        res.send(equipos);
    } catch (error){
        res.status(500).send({message: "Error al obtener los equipos"});
    }
};


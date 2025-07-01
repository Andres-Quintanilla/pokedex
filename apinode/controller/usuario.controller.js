const db = require("../models");

exports.listarUsuarios = async (req, res) => {
    try{
        const usuarios = await db.usuario.findAll({
            attributes: ['id', 'username', 'email', 'esAdmin']
        });

        res.send(usuarios);
    }catch (error){
        res.status(500).send({message: "Error al obtener los usuarios"});
    }
};

exports.hacerAdmin = async (req, res) => {
    const id = req.params.id;

    try{
        const usuario = await db.usuario.findByPk(id);

        if(!usuario){
            return res.status(404).send({message: "Usuario no encontrado"});
        }

        usuario.esAdmin = true;
        await usuario.save();

        res.send({message: "Usuario promovido a administrador"});
    }catch (error){
        res.status(500).send({message: "Error al actualizar el usuario"});
    }
};

exports.quitarAdmin = async (req, res) => {
    const id = req.params.id;

    try{
        const usuario = await db.usuario.findByPk(id);

        if(!usuario){
            return res.status(404).send({message: "Usuario no encontrado"});
        }

        usuario.esAdmin = false;
        await usuario.save();

        res.send({message: "El usuario ya no es administrador"});
    }catch (error){
        res.status(500).send({message: "Error al actualizar el usuario"});
    }
};
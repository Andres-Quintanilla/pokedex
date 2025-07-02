const db = require("../models");
const { generatePassword } = require("../utils/auth.utils");

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

exports.cambiarPassword = async (req, res) => {
    const { id } = req.params;
    const { nuevoPassword } = req.body;

    if(!nuevoPassword || nuevoPassword.length < 10){
        return res.status(400).send({message: "La nueva contraseña debe tener al menos 10 caracteres"});
    }

    try {
        const usuario = await db.usuario.findByPk(id);

        if(!usuario){
            return res.status(404).send({message: "Usuario no encontrado"});
        }

        const hashedNueva = generatePassword(nuevoPassword);

        if(usuario.password === hashedNueva){
            return res.status(400).send({message: "La nueva contraseña no puede ser igual a la anterior"});
        }

        usuario.password = hashedNueva;
        await usuario.save();

        res.send({message: "Contraseña actualizada correctamente"});
    } catch (error){
        res.status(500).send({message: "Error al cambiar la contraseña"});
    }
};
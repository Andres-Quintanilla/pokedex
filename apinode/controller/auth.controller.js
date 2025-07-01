const db = require("../models");
const { generateAuthToken, generatePassword } = require("../utils/auth.utils");

exports.register = async (req, res) =>{
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).send({message: "El nombre de usuario y la contraseña son requeridos"});
    }

    const existeUsuario = await db.usuario.findOne({
        where: {
            username: username
        }
    });

    if(existeUsuario){
        return res.status(400).send({message: "El nombre de usuario ya existe"});
    }

    const hashedPassword = await generatePassword(password);
    try{
        const usuario = await db.usuario.create({
            username: username,
            email: email,
            password: hashedPassword,
            esAdmin: false
        });
        res.send({
            id: usuario.id,
            username: usuario.username
        });
    }catch (error){
        return res.status(500).send({message: "Error al registrar el usuario"});
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).send({message: "El usuario y la contraseña son requeridos"});
    }

    const usuario = await db.usuario.findOne({
        where: {
            username: username
        }
    });

    if(!usuario){
        return res.status(401).send({message: "Usuario o contraseña incorrectos"});
    }

    const hashedPassword = generatePassword(password);

    if(usuario.password !== hashedPassword){
        return res.status(401).send({message: "Usuario o contraseña incorrectos"});
    }

    try{
        const authToken = await db.authToken.create({
            usuarioId: usuario.id,
            token: generateAuthToken(usuario.username)
        });

        res.send({
            token: authToken.token,
            username: usuario.username,
            esAdmin: usuario.esAdmin
        });
    }catch (error){
        return res.status(500).send({message: "Error al crear el token de autenticación"});
    }
};

exports.me = async (req, res) => {
    const usuario = res.locals.usuario;

    res.send({
        id: usuario.id,
        username: usuario.username,
        email:usuario.email,
        esAdmin: usuario.esAdmin
    });
};
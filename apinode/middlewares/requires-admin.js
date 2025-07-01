exports.requireAdmin = async (req, res, next) => {
    const usuario = res.locals.usuario;

    if(!usuario){
        return res.status(401).send(
            {message: "No autorizado"}
        );
    }

    if(!usuario.esAdmin){
        return res.status(403).send(
            {message: "Acceso solo para Administradores"}
        );
    }

    next();
};
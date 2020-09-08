const jwt = require("jsonwebtoken");

//middelware de autorizacion mediante token
module.exports.usuarioAutorizado = function (req, res, next) {
    try {
        let token = req.cookies["token"];

        if (!token) {
            return res.status(401).send("Tenes que iniciar sesion para acceder a este contenido");
        }
        let verificarToken = jwt.verify(token, process.env.SECRET_JWT);

        if (verificarToken) {
            req.usuario = verificarToken;
            return next();
        }
    } catch (error) {
        res.status(400).send("Error al validar usuario" + error);
    }
};


module.exports.verificarPermisosUsuario = function (req, res, next) {
    let permiso = req.usuario.permisoDeUsuario;
    
	if(permiso != 2) {
        return res.send('No tiene los permisos necesarios para acceder a esta página');
    }  

    return next();
}





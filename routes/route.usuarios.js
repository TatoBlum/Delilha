const express = require("express");
const jwt = require("jsonwebtoken");
const usuarioServicio = require("../services/services.usuarios");
const usuariosRepo = require("../repository/repo.usuarios");
const router = express.Router();
const { usuarioAutorizado, verificarPermisosUsuario } = require("../middleware/auth");

//registra usuario nuevo
router.post("/",async (req, res) => {
    try {
        let usuario = req.body;
        let validacion = await usuarioServicio.validarCamposNuevoUsuario(usuario);
        // console.log("validacion");
        // console.log(validacion);

        if (validacion.length > 0) {
            return res.status(400).json({ exito: false, data: validacion });
        }

        // Encriptar password
        const hashedPassword = await usuarioServicio.hashPassword(usuario);
        usuario.password = hashedPassword;

        let usuarioNuevo = await usuariosRepo.registrarUsuario(usuario);
        
        //checkear resultado e informar en front
        return res.status(201).json({ exito: true, data: usuarioNuevo });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

//iniciar sesion de usuario
router.post("/iniciarsesion", async (req, res) => {
    let usuario = req.body; // email, password
    try {
        //checkeo email y contraseña valida
        let validacion = await usuarioServicio.validarCamposInicioSesion(
            usuario
        );

        if (validacion.length > 0) {
            res.status(400).json({ exito: false, data: validacion });
            return;
        }

        //buscar id del usuario
        console.log(req.body.email);
        console.log(process.env.SECRET_JWT);
        let usuarioDataStore = await usuarioServicio.buscarUsuarioPorEmail(
            req.body.email
        );
        usuarioDataStore = usuarioDataStore[0];

        //generar Token
        let token = jwt.sign(
            {
                id: usuarioDataStore.id,
                nombre: usuarioDataStore.nombre,
                permisoDeUsuario: usuarioDataStore.permisosId 
            },
            process.env.SECRET_JWT
        );
        console.log("token");
        console.log(token);

        //Agrego el token a la cookie
        res.cookie("token", token, { httpOnly: true });
        res.status(200).send({ exito: true, data: "Login Ok" });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

//modificar usuario
router.put('/modificar', usuarioAutorizado, async (req, res) => {
	try {
        let nuevoUsuario = req.body;
        let usuarioId = req.usuario.id;   

        let validacion = await usuarioServicio.validarCamposNuevoUsuario(nuevoUsuario);

        if (validacion.length > 0) {
            return res.status(400).json({ exito: false, data: validacion });
        }

        // Encriptar password
        const hashedPassword = await usuarioServicio.hashPassword(nuevoUsuario);
        nuevoUsuario.password = hashedPassword;

        let modificar  = await usuariosRepo.modificarUsuario(nuevoUsuario, usuarioId)
	
		res.status(201).json(modificar);
		
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//modificar permisos, solo usuarios admin
router.put('/modificarPermisos', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {
        //permisosId
        let usuarioId = await usuariosRepo.buscarUsuarioPorId(req.body.id);
        //console.log(usuarioId[0].id);

        let modificarPermisos  = await usuariosRepo.modificarPermiso(usuarioId[0].id, req.body);
	
		res.status(201).json(modificarPermisos);		
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//borrar usuario
router.delete('/borrarUsuario', usuarioAutorizado, async (req, res) => {
	try {
        let usuarioId = req.usuario.id;

        let borrar  = await usuariosRepo.borrarUsuario(usuarioId);
	
		res.status(201).json("Usuario borrado con exito");		
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//solo habilitar cuando se haya creado la autorizacion para admin
//devuelve informacion del usuario por id.
router.get("/", usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
    let usuarioId = req.headers.id;
    let usuario = await usuarioServicio.buscarUsuarioPorId(usuarioId);
    res.status(200).json({ exito: true, data: usuario[0] });
});

//generar listado de todos los usuarios, solo admin
router.get("/listado", usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
    let usuarios = await usuariosRepo.listarUsuarios();
    res.status(200).json({ exito: true, data: usuarios });
});

module.exports = router;

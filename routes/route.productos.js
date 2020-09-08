const express = require("express");
const router = express.Router();
const productoServicio = require("../services/services.productos");
const { usuarioAutorizado, verificarPermisosUsuario } = require("../middleware/auth");
const { validarCamposInicioSesion } = require("../services/services.usuarios");
const repoProd = require('../repository/repo.productos');

//Crear productos, solo admin
router.post("/", usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
    try {
        let nuevoProducto = req.body;
        // let idUsuario = req.idUsuario;

        console.log(req.idUsuario);
        console.log(nuevoProducto);
        
        let validacion = await productoServicio.validarCamposProductoNuevo(nuevoProducto);
        if (validacion.length > 0) {
            return res.status(400).json({ exito: false, data: validacion });
        }
        
        let resultado = await productoServicio.crearProducto(nuevoProducto);
        if (resultado) {
            res.status(201).json({ exito: true, data: resultado });
        } else {
            res.status(400).json({
                exito: false,
                data: "No se pudo crear el producto",
            });
        }
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

//Modificar producto, solo admin
router.put('/modificar', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {

        let validarId = await productoServicio.validarIdProducto(req.headers.id);  
        
        if (validarId.length > 0) {
            return res.status(400).json({ exito: false, data: validarId });
        }

        let productoId = await repoProd.buscarProductoPorId(req.headers.id);   

        let modificar  = await repoProd.modificarProducto(productoId[0].id, req.body);
	
		res.status(201).json(modificar);
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//Borrar producto, solo admin
router.delete('/eliminar', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {

        let validarId = await productoServicio.validarIdProducto(req.headers.id);  
        
        if (validarId.length > 0) {
            return res.status(400).json({ exito: false, data: validarId });
        }

        let productoId = await repoProd.buscarProductoPorId(req.headers.id);   

        let borrar  = await repoProd.borrarProducto(productoId[0].id);
	
		res.status(201).json("Producto borrado con exito");
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//Listar todos los productos
router.get("/", usuarioAutorizado, async (req, res) => {
    let productos = await repoProd.listarProductos();
    res.status(200).json({ exito: true, data: productos });
});


module.exports = router;

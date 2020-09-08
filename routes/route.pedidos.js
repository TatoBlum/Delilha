const express = require("express");
const router = express.Router();
const productoServicio = require("../services/services.productos");
const pedidosServices = require('../services/services.pedidos');
const { usuarioAutorizado, verificarPermisosUsuario } = require("../middleware/auth");
const { validarCamposInicioSesion } = require("../services/services.usuarios");
const repoPedidos = require('../repository/repo.pedidos');

//Crear un pedido
router.post("/", usuarioAutorizado, async (req, res) => {
    try {
        let nuevoPedido = req.body;
        let idUsuario = req.usuario.id;
        
        let validacion = await pedidosServices.validarCamposPedidoNuevo(nuevoPedido);
        if (validacion.length > 0) {
            return res.status(400).json({ exito: false, data: validacion });
        }
        // console.log(validacion);
        
        let resultado = await repoPedidos.crearPedido(nuevoPedido, idUsuario);

        let idPedido = resultado[0];

        if (resultado) {
            // res.cookie('pedido', idPedido);
            res.status(201).json({ exito: true, data: resultado });
        } else {
            res.status(400).json({
                exito: false,
                data: "No se pudo crear el pedido",
            });
        }
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

//Modificar orden de pedido, solo admin
router.put('/modificar', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {
        let cambiarPedido = req.body;
        
        //validar
        let validarId = await pedidosServices.validarIdPedido(req.headers.id);  
        
        if (validarId.length > 0) {
            return res.status(400).json({ exito: false, data: validarId });
        }

        let validacion = await pedidosServices.validarCamposPedidoNuevo(cambiarPedido);

        if (validacion.length > 0) {
            return res.status(400).json({ exito: false, data: validacion });
        }

        let pedido = await repoPedidos.buscarPedidoPorId(req.headers.id);   

        let modificar  = await repoPedidos.modificarPedido(pedido[0].id, cambiarPedido);
	
		res.status(201).json(modificar);
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//Borrar orden de pedido, admin
router.delete('/eliminar', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {
        let validar = await pedidosServices.validarIdPedido(req.headers.id);  

        if (validar.length > 0) {
            return res.status(400).json({ exito: false, data: validar });
        }

        let buscarProductoDePedido = await repoPedidos.buscarProductosEnPedido(req.headers.id);
        
        if (buscarProductoDePedido.length > 0) {
            let borrarProd = await repoPedidos.borrarDetalleDePedido(req.headers.id);
        }

        let pedido = await repoPedidos.buscarPedidoPorId(req.headers.id);  

        let borrar  = await repoPedidos.borrarPedido(pedido[0].id);
	
		res.status(201).json('El pedido ha sido borrardo');
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//Cargar producto a orden de pedido
router.post("/carga", usuarioAutorizado, async (req, res) => {
    try {
        let cargarProducto = req.body;
        // let idPedido = req.cookies["pedido"];  // id pedido por headers
        let idPedido = req.headers.id

        let validar = await pedidosServices.validarIdPedido(idPedido);  

        if (validar.length > 0) {
            return res.status(400).json({ exito: false, data: validar });
        }

        console.log(idPedido);
        
        let validarIdProducto = await productoServicio.validarIdProducto(req.body.productoId);  
        
        if (validarIdProducto.length > 0) {
            return res.status(400).json({ exito: false, data: validarIdProducto });
        }
        
        let resultado = await repoPedidos.cargarProductosAlPedido(idPedido, cargarProducto);

        if (resultado) {
            res.status(201).json({ exito: true, data: resultado });
        } else {
            res.status(400).json({
                exito: false,
                data: "No se pudo crear el pedido",
            });
        }
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

//Borrar producto de orden de pedido, solo admin 
router.delete('/eliminarproductos', usuarioAutorizado, verificarPermisosUsuario, async (req, res) => {
	try {

        let pedidoId = req.headers.id;

        let productoId = req.body.productoId;

        //validar pedido id
        let validar = await pedidosServices.validarIdPedido(pedidoId);  

        if (validar.length > 0) {
            return res.status(400).json({ exito: false, data: validar });
        }
        
        //validar producto en detalle 
        let bucarProducto = await repoPedidos.buscarProductoEnDetalle(pedidoId,productoId);
        // console.log(bucarProducto.length)  

        if (bucarProducto.length == 0) {            
            res.status(404).json({
                exito: false,
                Error:'El pedido no contiene el producto ingresado'
            });
        }

        let borrar  = await repoPedidos.borrarProductoDeDetalleDePedido(pedidoId,productoId);
	
		res.status(201).json('El producto del pedido han sido borrardo');
		
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

//Detalle de pedidos por id de usuario  
router.get("/", usuarioAutorizado, async (req, res)=> {
    try{
        // let idPedido = req.cookies["pedido"];
        let idUsuario = req.usuario.id;

        let resultado = await repoPedidos.generarDetalleDePedidosPorUsuario(idUsuario);

		if (resultado) {
			res.status(200).json(resultado);
		} else {
			res.status(404).json({ Error: 'Usuario no encontrado' });
		}
           
    }catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

//Detalle de todos los pedidos solo admin
router.get("/lista", usuarioAutorizado, verificarPermisosUsuario, async (req, res)=> {
    try{

        // let idUsuario = req.usuario.id;

        let resultado = await repoPedidos.generarDetalleDeTodosLosPedidos();

		if (resultado) {
			res.status(200).json(resultado);
		} else {
			res.status(404).json({ Error: 'Usuario no encontrado' });
		}
           
    }catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

module.exports = router;

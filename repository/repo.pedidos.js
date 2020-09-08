const express = require('express');
const sql = require('../connection');

module.exports.crearPedido =  async (pedido, id)=>{
    let fechaDeCreacion = null;

    return new Promise ((res, rej)=>{
        sql.query( `
            INSERT INTO pedidos
            (formaDePagoId, usuarioId, fechaDeCreacion) 
            values (?,?,?)
            `, 
            {replacements: [pedido.formaDePagoId, id, fechaDeCreacion]}).then(resultado => {
            res(resultado);
        }).catch( error => {
            rej(error)
        })   
    })
}

module.exports.buscarPedidoPorId = async (id)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM pedidos WHERE id = :idPedido', { replacements: {idPedido: id},
        type: sql.QueryTypes.SELECT }).then(resultado => {
            if (resultado) {
                res(resultado);
            }     
        }).catch( error => {
            rej(error);
        })    
    })
} 

module.exports.buscarProductosEnPedido = async (id)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT productoId FROM detalleDePedido WHERE pedidoId = :idPedido', { replacements: {idPedido: id},
        type: sql.QueryTypes.SELECT }).then(resultado => {
            console.log(resultado);
            if (resultado) {
                res(resultado);
            }     
        }).catch( error => {
            rej(error);
        })    
    })
} 

//Buscar un producto en el detalle por idProducto
module.exports.buscarProductoEnDetalle = async (id, productoId)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM detalleDePedido WHERE pedidoId = :id AND productoId = :productoId', {
            replacements: {
                id: id,
                productoId: productoId
            },
        type: sql.QueryTypes.SELECT }).then(resultado => {
            console.log("hola2")
            console.log(resultado);
            if (resultado) {
                res(resultado);
            }     
        }).catch( error => {
            rej(error);
        })    
    })
} 

module.exports.modificarPedido = async (id, cambiarPedido) => {
    console.log(cambiarPedido);
    console.log(id);
    return new Promise( (res, rej)=> {
        sql.query('UPDATE pedidos SET formaDePagoId = :formaDePagoId, estadoId = :estadoId, fechaDeModificacion = null WHERE id = :id', {
            replacements: {
                id: id,
                formaDePagoId: cambiarPedido.formaDePagoId,
                estadoId: cambiarPedido.estadoId
            },
            type: sql.QueryTypes.UPDATE }).then(resultado => {
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
    })
}
    
module.exports.borrarPedido = async (id) => {
    return new Promise( (res, rej)=>{
       sql.query('DELETE FROM pedidos WHERE id = :id', {
            replacements: {
                id: id
            },
            type: sql.QueryTypes.DELETE}).then(resultado => {
                console.log(resultado)
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })     
}

//Borrar producto (por idProducto) de detalleDePedido
module.exports.borrarProductoDeDetalleDePedido = async (id, productoId) => {
    return new Promise( (res, rej)=>{
       sql.query('DELETE FROM detalleDePedido WHERE pedidoId = :id AND productoId = :productoId', {
            replacements: {
                id: id,
                productoId: productoId
            },
            type: sql.QueryTypes.DELETE}).then(resultado => {
                console.log(resultado)
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })     
}

//Borrar todos los producto de detalle de pedido segun idPedido
module.exports.borrarDetalleDePedido = async (id) => {
    return new Promise( (res, rej)=> {
        sql.query('DELETE FROM detalleDePedido WHERE pedidoId = :id',{
            replacements: { id: id 
            },
            type: sql.QueryTypes.DELETE     
        }).then(resultado => {
            res(resultado);
        }).catch( error => {
            rej(error);
        })   
    }) 
}


//get pedido con join a detalle pedidos
module.exports.cargarProductosAlPedido = async (pedidoId, cargarProducto) =>{
    return new Promise ((res, rej)=>{
        sql.query( `
            INSERT INTO detalleDePedido
            (pedidoId, productoId) 
            values (?,?)
            `, 
            {replacements: [pedidoId, cargarProducto.productoId]}).then(resultado => {
            res(resultado);
        }).catch( error => {
            rej(error)
        })   
    })
}

class DetalleDePedido {
	constructor(datosPedido, productosDePedido,precioTotal) {
        this.datosPedido = datosPedido, 
        this.productosDePedido = productosDePedido, 
        this.precioTotal = precioTotal
	}
	datosPedido = {};
    productosDePedido = [];
    precioTotal;
}

//Ordenes de pedido por usuario id
module.exports.generarDetalleDePedidosPorUsuario = async (id) => {
    try{
        let pedidos = await sql.query(
		    'SELECT pedidos.id, estados.nombre, formasDePago.nombre AS NombreFormaDepago, usuarios.id AS usuarioId FROM pedidos JOIN estados ON pedidos.estadoId = estados.id JOIN formasDePago ON pedidos.formaDePagoId = formasDePago.id JOIN usuarios ON pedidos.usuarioId = usuarios.id WHERE usuarios.id = :id', {
            replacements: {
                id: id},
            type: sql.QueryTypes.SELECT })

        let productos = await sql.query(
			`SELECT productos.id AS productoId, productos.nombre, productos.precio, detalleDePedido.pedidoId FROM detalleDePedido JOIN productos ON detalleDePedido.productoId = productos.id JOIN pedidos ON detalleDePedido.pedidoId = pedidos.id`,
			{ type: sql.QueryTypes.SELECT }
        )

        let precioPedido = await sql.query(
            `SELECT detalleDePedido.pedidoId, SUM(productos.precio) AS precioTotalPedido FROM detalleDePedido JOIN productos ON detalleDePedido.productoId = productos.id WHERE 1 GROUP by pedidoId`,  
        { type: sql.QueryTypes.SELECT });

        let resultados = [];

        pedidos.forEach( pedido => {
            let productosDelPedido = [];
            let precioTotalPedido = [];
            productos.forEach( producto =>{
                if (pedido.id == producto.pedidoId) {
                productosDelPedido.push(producto);
                }
            });
            precioPedido.forEach( total=>{
                if (pedido.id == total.pedidoId) {
                precioTotalPedido.push(total);
                }      
            });

            let pedidoCompleto = new DetalleDePedido(pedido, productosDelPedido, precioTotalPedido);
            resultados.push(pedidoCompleto);
         }); 
        
		return resultados;
    } catch (error) {
        	return error;
    }	            
}

module.exports.generarDetalleDeTodosLosPedidos = async () => {
    try{
        let pedidos = await sql.query(
            'SELECT pedidos.id, estados.nombre, formasDePago.nombre AS NombreFormaDepago, usuarios.id AS usuarioId FROM pedidos JOIN estados ON pedidos.estadoId = estados.id JOIN formasDePago ON pedidos.formaDePagoId = formasDePago.id JOIN usuarios ON pedidos.usuarioId = usuarios.id', 
            { type: sql.QueryTypes.SELECT }
        )

        let productos = await sql.query(
			`SELECT productos.id AS productoId, productos.nombre, productos.precio, detalleDePedido.pedidoId FROM detalleDePedido JOIN productos ON detalleDePedido.productoId = productos.id JOIN pedidos ON detalleDePedido.pedidoId = pedidos.id`,
			{ type: sql.QueryTypes.SELECT }
        )

        let precioPedido = await sql.query(
            `SELECT detalleDePedido.pedidoId, SUM(productos.precio) AS precioTotalPedido FROM detalleDePedido JOIN productos ON detalleDePedido.productoId = productos.id WHERE 1 GROUP by pedidoId`,  
        { type: sql.QueryTypes.SELECT });

        let resultados = [];

        pedidos.forEach( pedido => {
            let productosDelPedido = [];
            let precioTotalPedido = [];
            productos.forEach( producto =>{
                if (pedido.id == producto.pedidoId) {
                productosDelPedido.push(producto);
                }
            });
            precioPedido.forEach( total=>{
                if (pedido.id == total.pedidoId) {
                precioTotalPedido.push(total);
                }      
            });

            let pedidoCompleto = new DetalleDePedido(pedido, productosDelPedido, precioTotalPedido);
            resultados.push(pedidoCompleto);
         }); 
        
		return resultados;
    } catch (error) {
        	return error;
    }	            
}












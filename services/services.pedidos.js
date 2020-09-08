const repoProductos = require('../repository/repo.productos');
const repoPedidos = require('../repository/repo.pedidos');
const sql = require('../connection');

//pedido 
module.exports.validarCamposPedidoNuevo = async function (pedido){
    const { formaDePagoId, usuarioId } = pedido;
     let errores = [];

    if (!formaDePagoId ){
         errores.push({
             mensaje: "Faltan completar campos",
         });
    }

    if (isNaN(formaDePagoId)){
        errores.push({
            mensaje: "Ingrese un valor numerico"
        });
    }

    if (formaDePagoId != 2 && formaDePagoId != 1 ){
        errores.push({
            mensaje: "Ingreso una forma de pago inexistente"
        });
    } 

    if(usuarioId){
        errores.push({
            mensaje: "Usuario invalido, no ingrese informacion en este campo"
        });
    }

    return errores
}

//metodo para validar ID de pedido
module.exports.validarIdPedido = async function (id) {
    let errores = [];

    //checkear campos vacios
    if (!id) {
        errores.push({ mensaje: "No ingreso el numero de pedido" });
        return errores;
    }

    //buscar si el email esta registrado en la base de datos
    let pedidoPorId = await repoPedidos.buscarPedidoPorId(id);

    if (pedidoPorId.length != 1) {
        errores.push({ mensaje: "El pedido ingresado no existe" });
        return errores;
    }

    return errores;
};



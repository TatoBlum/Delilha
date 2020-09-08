const repoProductos = require('../repository/repo.productos');
const repoUsuarios = require('../repository/repo.usuarios');
const sql = require('../connection');

//crear producto
module.exports.crearProducto = async function (producto) {
    let nuevoproducto = await repoProductos.registrarProducto(producto);
    if (!nuevoproducto) {
        throw new Error("Error, no se pudo crear el producto");
    } else {
        return producto;
    }
};

module.exports.validarCamposProductoNuevo = async function (producto){
    const { nombre, precio } = producto;
     let errores = [];
     //checkear campos vacios
     if (!nombre || !precio) {
         errores.push({
             mensaje: "Faltan completar campos",
         });
     }
     if(nombre.length < 1){
        errores.push({mensaje:"El nombre del producto debe tener al menos 6 caracteres"})
    }

    if (isNaN(precio)){
        errores.push({
            mensaje: "Ingrese un valor numerico"
        });
    }

    return errores
}

module.exports.validarIdProducto = async function (id) {
    let errores = [];

    //checkear campos vacios
    if (!id) {
        errores.push({ mensaje: "No ingreso el numero de producto" });
        return errores;
    }

    //buscar si el email esta registrado en la base de datos
    let productoPorId = await repoProductos.buscarProductoPorId(id);

    if (productoPorId.length != 1) {
        errores.push({ mensaje: "El producto ingresado no existe" });
        return errores;
    }

    return errores;
};




/*
module.exports.validacioDePedido = async function (pedido) {
    // console.log('prueba');
    // console.log(pedido);
    // console.log(pedido.ordenDePedido == null);
    // validar campor vacios con foreing key

    const { ordenDePedido, idProducto, idPersona } = pedido;
    let errores = [];

    if (!ordenDePedido || !idProducto || !idPersona) {
        errores.push({
            mensaje: "Faltan completar campos",
        });
    }

    let validarProducto = await repoProductos.buscarProductoPorId(pedido.idProducto);
    if (!validarProducto) {
        errores.push({
            mensaje: "No existe este producto"
        })
    } 

    let validarUsuario = await repoUsuarios.buscarUsuarioPorId(pedido.idPersona);
    if (validarUsuario.length < 1) {
        errores.push({
            mensaje:  "No existe este usuario "
        })
    } 

    return errores
}

module.exports.realizarUnPedido = async function (pedido) {
  try {

    const nuevoPedido = await repoProductos.tomarPedido(pedido);

    //cambiar stock del producto 
    
    return true;

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.getIdUsuarioPorProductoId = async function (id) {
    let producto =  await repoProductos.buscarProductoPorId(id);
    return producto;
};
*/
/*
module.exports.buscarProductoPorPalabraClave = function (busqueda) {
    //buscar palabra clave en la descripcion del producto o nombre del produco
    let lista = baseDatos.productos.filter(
        (item) =>
            item.descripcion.includes(busqueda) ||
            item.nombreProducto.includes(busqueda)
    );
    if (lista.length > 0) {
        return lista;
    } else {
        return null;
    }
};

module.exports.filtrarPorEstado = function (lista, estado) {
    if (estado === "nuevo") {
        let listaNuevos = lista.filter((item) => item.estado == "nuevo");
        if (listaNuevos.length > 0) {
            return listaNuevos;
        } else {
            return null;
        }
    }

    if (estado === "usado") {
        let listaUsados = lista.filter((item) => item.estado == "usado");
        if (listaUsados.length > 0) {
            return listaUsados;
        } else {
            return null;
        }
    }
};

module.exports.listarProductos = function () {
    return baseDatos.productos;
};
*/


const express = require('express');
const sql = require('../connection');

//crear producto
module.exports.registrarProducto =  async (producto)=>{
    return new Promise ((res, rej)=>{
        sql.query( `
            INSERT INTO productos
            (nombre, precio) 
            values (?,?)
            `, 
            {replacements: [producto.nombre, producto.precio]}).then(resultado => {
            res(resultado);
        }).catch( error => {
            rej(error)
        })   
    })
}

module.exports.buscarIdUsuarioPorProductoId = async (id)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM productos WHERE id = :idProducto', { replacements: {idProducto: id},
        type: sql.QueryTypes.SELECT }).then(resultado => {
            //console.log(resultado);
            res(resultado[0].idUsuario);
        }) 
    })
} 

module.exports.buscarProductoPorId = async (id)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM productos WHERE id = :idProducto', { replacements: {idProducto: id},
        type: sql.QueryTypes.SELECT }).then(resultado => {
            console.log(resultado)
            if (resultado) {
                res(resultado);
            } else {
                rej('Error, prodcuto no existe');
            }            
        }) 
    })
} 

module.exports.modificarProducto = async (id, cambiarProducto) => {
    console.log(cambiarProducto);
    console.log(id);
    return new Promise( (res, rej)=> {
        sql.query('UPDATE productos SET nombre = :nombre, precio = :precio WHERE id = :id', {
            replacements: {
                id: id,
                nombre: cambiarProducto.nombre,
                precio: cambiarProducto.precio
            },
            type: sql.QueryTypes.UPDATE }).then(resultado => {
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })
    }
    

module.exports.borrarProducto = async (id) => {
    return new Promise( (res, rej)=>{
       sql.query('DELETE FROM productos WHERE id = :id', {
            replacements: {
                id: id
            },
            type: sql.QueryTypes.DELETE}).then(resultado => {
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })     
}

module.exports.listarProductos =  async()=> {
    return new Promise((r, rej) => {
        sql.query('SELECT * FROM productos').then(resultado => {
        r(resultado[0]);
        }) 
    })    
} 



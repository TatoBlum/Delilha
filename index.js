const express = require('express');
const server = express();
const cookieParser = require("cookie-parser"); 
const { usuarioAutorizado, verificarPermisosUsuario } = require("./middleware/auth");
const dotenv = require('dotenv').config(); //variables de entorno: .env
const sql = require('./connection');

server.use(express.json()); //express json 
server.use(cookieParser());

//Rutas
const routeUsuarios = require('./routes/route.usuarios');
const routeProductos = require('./routes/route.productos');
const routePedidos = require('./routes/route.pedidos');
server.use("/usuarios", routeUsuarios);
server.use("/productos", routeProductos);
server.use("/pedidos", routePedidos);

server.use( (err, req, res, next)=>{
    if(err){
        //headersSent
        if(!res.headersSent){
            console.log(err);
            res.status(500).send('Error en servidor'+err.message);
        }
    }
    next();
});

server.listen(3000, (err)=>{
    console.log('servidor listo, puerto 3000');
});
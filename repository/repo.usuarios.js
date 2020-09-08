const sql = require('../connection');

module.exports.listarUsuarios =  async() => {
    return new Promise((r, rej) => {
        sql.query('SELECT * FROM usuarios').then(resultado => {
        r(resultado[0]);
        }).catch( error => {
            rej(error);
        })    
    })    
}

module.exports.registrarUsuario = async (usuario)=>{
    return new Promise ((res, rej)=>{
        let fechaDeCreacion = null;

        sql.query( `
            INSERT INTO usuarios
            (nombre, apellido, email, telefono, direccion, password, fechaDeCreacion) 
            values (?,?,?,?,?,?,?)
            `, 
            {replacements: [usuario.nombre,
                            usuario.apellido, 
                            usuario.email, 
                            usuario.telefono, 
                            usuario.direccion,
                            usuario.password,
                            fechaDeCreacion 
                           ],type: sql.QueryTypes.INSERT }).then(resultado => {
            res(resultado);
        }).catch( error => {
            rej(error);
        })   
    })
}

module.exports.buscarUsuarioPorId = async (id)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM usuarios WHERE id = :usuarioId', { replacements: {usuarioId: id},
        type: sql.QueryTypes.SELECT }).then(resultado => {
            console.log("usuarioid");
            console.log(resultado);
            res(resultado);
        }) 
    })
} 

module.exports.buscarUsuarioPorE = async (email)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM usuarios WHERE email = :usuarioEmail', { replacements: {usuarioEmail: email},
        }).then(resultado => {
            res(resultado[0]);
        }).catch( error => {
            rej(error)
        })    
    })
} 

module.exports.buscarPermisoValido = async (idPermiso)=> {
    return new Promise((res, rej)=>{
        sql.query('SELECT * FROM permisos WHERE id = :permisoIngresado', { replacements: {permisoIngresado: idPermiso},
        }).then(resultado => {
            console.log(resultado)
            res(resultado[0]);
        }).catch( error => {
            rej(error)
        })   
    })
}

module.exports.modificarUsuario = async (cambiarUsuario,id) => {
    return new Promise( (res, rej)=> {

        sql.query('UPDATE usuarios SET nombre = :nombre, apellido = :apellido, email = :email, telefono = :telefono, direccion = :direccion, password = :password, fechaDeModificacion = null WHERE id = :id', {
            replacements: {
                nombre: cambiarUsuario.nombre,
                apellido: cambiarUsuario.apellido,
                email: cambiarUsuario.email,
                telefono: cambiarUsuario.telefono,
                direccion: cambiarUsuario.direccion,
                password: cambiarUsuario.password,
                id: id,
            },
            type: sql.QueryTypes.UPDATE }).then(resultado => {
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })
    }
    
module.exports.modificarPermiso = async (id, payload) => {
    console.log("id")
    console.log(id.id)

    if (payload.permisosId != 2 && payload.permisosId != 1 ){
        return ("Ingreso un permiso inexistente");
    } else {
        return new Promise( (res, rej)=> {
            sql.query('UPDATE usuarios SET permisosId = :permisosId WHERE id = :id', {
                replacements: {
                    permisosId : payload.permisosId,
                    id: id
                },
                type: sql.QueryTypes.UPDATE }).then(resultado => {
                    console.log(resultado);
                    res(resultado);
                }).catch( error => {
                    rej(error);
                })   
            })
    }
}   

module.exports.borrarUsuario = async (id) => {
    return new Promise( (res, rej)=>{
       sql.query('DELETE FROM usuarios WHERE id = :id', {
            replacements: {
                id: id
            },
            type: sql.QueryTypes.DELETE}).then(resultado => {
                // console.log(resultado);
                res(resultado);
            }).catch( error => {
                rej(error);
            })   
        })     
}

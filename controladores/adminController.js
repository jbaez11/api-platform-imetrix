//Importar el modelo
let Administrador = require('../modelos/adminModel');
let User = require('../modelos/userModel')
const jwt = require('jsonwebtoken');

//Requerir modulo para encriptar las contraseñas
const bcrypt = require('bcrypt');

/*-------------------------------------------
  PETICIONES PARA EL CRUD DE ADMINISTRADORES 
-------------------------------------------*/

/*PETICIÓN POST PARA CREAR UN ADMINISTRADOR*/
let addAdmin = (req, res) =>{
    //Obtenemos el cuerpo del formulario
    let body = req.body;

    let admin = new Administrador({

        nombres: body.nombres,
        correo: body.correo,
        telefono: body.telefono,
        cedula: body.cedula,
        password: body.password,//bcrypt.hashSync(body.password, 10),
        role: body.role,
        clusters: body.clusters,
        state: body.state,
        nombreEmpresa: body.nombreEmpresa,
        pais: body.pais
        
    })

    //Guardamos en BD
    admin.save((err, data) => {
        
        if(err){

            return res.json({

                Status: 400,
                mensaje: "Error al crear el Administrador",
                err
                
            })
        }
                        
        res.json({
        
            status: 200,
            data,
            mensaje: "El Administrador ha sido creado con exito."
        
        })
    })
}

/* PETICIÓN PARA OBTENER UN SOLO ADMINISTRADOR */
let getAdmin = (req, res) =>{
    let id = req.params.id;

    Administrador.find({"_id": id})
    .populate({path:"clusters", model:"Cluster"})
    .exec((err, data) => {
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }  
        res.json({
            Status: 200,
            data
        })
       
    })
}

/* PETICION PUT PARA EDITAR UN ADMINISTRDOR */
let editAdmin = (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    //Buscamos el id que se pasas por parametro del documento a editar
    Administrador.findById(id, (err, data) =>{

        //Validamos que no ocurra error en el proceso
        if(err){
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err 
            }) 
        }

        //Validamos que la categoria exista
        if(!data){
            return res.json({
                status: 400,
                mensaje: "El Administrador no existe en la BD",
                err 
            }) 
        }

        let previousPassword = data.password;

        //validamos que haya cambio de contraseña
        let validarCambioPassword = (body, previousPassword) =>{

            return new Promise((resolve, reject) =>{

                if(body.password == ""){

                    resolve(previousPassword);

                }else{

                    previousPassword = body.password //bcrypt.hashSync(body.password, 10);
                    resolve(previousPassword);

                }


            })
        }

        //actualizamos los datos
        let guardarCambiosBD = (id, body, previousPassword) =>{

            return new Promise((resolve, reject) =>{

                let datosUser = {
                  
                    nombres: body.nombres,
                    correo: body.correo,
                    telefono: body.telefono,
                    cedula: body.cedula,
                    password: body.previousPassword,//bcrypt.hashSync(body.password, 10),
                    role: body.role,
                    clusters: body.clusters,
                    state: body.state,
                    nombreEmpresa: body.nombreEmpresa,
                    pais: body.pais

                }
        
                Administrador.findByIdAndUpdate(id, datosUser, {new: true, runValidators: true}, (err, data)=>{

                    if(err){

						let respuesta = {

							res: res,
							error: err
						}

						reject(respuesta);

					}		

					let respuesta = {

						res: res,
						data: data 
					}

					resolve(respuesta);
                })

            })

        }

        
        //Sincronizamos las promesas
        validarCambioPassword(body, previousPassword).then(previousPassword =>{
            guardarCambiosBD(id, body, previousPassword).then(respuesta =>{

                respuesta["res"].json({
                    status: 200,
                    data: respuesta["data"],
                    mensaje: "Administrador se ha actualizado con exito."
                })

            }).catch(respuesta =>{

                respuesta["res"].json({
                    status: 400,
                    data: respuesta["err"],
                    mensaje: "Error al editar el Administrador."
                })

            })
        }).catch(respuesta =>{

            respuesta["res"].json({
                status: 400,
                mensaje: respuesta["mensaje"]
            })

        })
    })
}//PUT

/* PETICION DELETE PARA ELIMINAR UN ADMINISTRADOR */
let deleteAdmin = (req, res) => {
    //capturamos el ID del Administrador a borrar
    let id = req.params.id;

    //Evitar borrar un unico administrador
    Administrador.find({})
    .exec((err, data) => {
   
        //Contar la cantidad de documentos dentro de la colección
        Administrador.countDocuments({}, (err, total) => {
            //Si hay un error en la Petición
            if(Number(total) == 1){
                return res.json({
                    status: 400,
                    mensaje: "No se puede eliminar el unico administrador que existe."
                })
            }

            //Buscamos el id que se pasa por parametro del documento a eliminar
            Administrador.findById(id, (err, data) =>{

                //Validamos que no ocurra error en el proceso
                if(err){
                    return res.json({
                        status: 500,
                        mensaje: "Error en el servidor",
                        err 
                    }) 
                }

                //Validamos que el administrador exista
                if(!data){
                    return res.json({
                        status: 400,
                        mensaje: "El Administrador no existe en la BD",
                        err 
                    }) 
                }

                //Borramos registro en BD
                Administrador.findByIdAndRemove(id, (err, data) =>{
                    //Validamos que no ocurra error en el proceso
                    if(err){
                        return res.json({
                            status: 400,
                            mensaje: "Error al borrar el Administrador",
                            err 
                        }) 
                    }

                    res.json({
                        status: 200,
                        mensaje: "El Administrador ha sido eliminado correctamente de la Colección"
                    })
                })
            })
        })
    })
}

/* FUNCION LOGIN PARA ADMINISTRADORES */
let loginAdmin = (req, res) =>{

    let body = req.body;

    Administrador.findOne({correo: body.correo}, (err, data) =>{

        //Validamos que no ocurra error en el proceso
        if(err){
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err 
            }) 
        }

        //Validamos que el correo es correcto
        if(!data){
            //console.log('body correo 1', body.correo)
             User.findOne({correo: body.correo}, (err, data) =>{
               // if(auditor){
                    //console.log('body correo 2', body.correo)
                    if(err){
                        return res.json({
                            status: 500,
                            mensaje: "Error en el servidor",
                            err 
                            
                        }) 
                    }
    
                    if(!data){
                        return res.json({
                            status: 400,
                            mensaje: "El Usuario es incorrecto",
                            err 
                        }) 
                    }
    
                    if(body.password != data.password){
                        return res.json({
                            status: 400,
                            mensaje: "La contraseña es incorrecta",
                            err 
                        }) 
                    }

                    if(data.state === 0){
                        return res.json({
                            status: 400,
                            mensaje: "Este usuario se encuentra inhabilitado.",
                            err 
                        }) 
                    }

                    //Generar el token de Autorización
                    let token = jwt.sign({
                        data
                    }, process.env.SECRET, {expiresIn: 60*60*24*30})

                    res.json({
                        status: 200,
                        token,
                        data
                    })
                })
            
            }
            //console.log('body correo 3', body.correo)
            //if(!bcrypt.compareSync(body.password, data.password)){
            if(data){
                if(body.password != data.password){
                    return res.json({
                        status: 400,
                        mensaje: "La contraseña es incorrecta",
                        err 
                    }) 
                }
                
                if(data.state === 0){
                    return res.json({
                        status: 400,
                        mensaje: "Este usuario se encuentra inhabilitado.",
                        err 
                    }) 
                }

                //Generar el token de Autorización
                let token = jwt.sign({
                    data
                }, process.env.SECRET, {expiresIn: 60*60*24*30})

                res.json({
                    status: 200,
                    token,
                    data
                })
            }   
    })
}

//EXPORTAMOS LAS FUNCIONES
module.exports = {addAdmin, getAdmin, editAdmin, deleteAdmin, loginAdmin}
//Importar el modelo
let User = require('../modelos/userModel');
let Cluster = require('../modelos/clusterModel');
let Campaing = require('../modelos/campaingModel');
const jwt = require('jsonwebtoken');

//Requerir modulo para encriptar las contraseñas
const bcrypt = require('bcrypt');

/* PETICIÓN POST PARA CREAR UN USUARIO */
let addUser = async (req, res) =>{ 
    try{
    //Obtenemos el cuerpo del formulario
    let body = req.body;

        let user = new User({

            nombres: body.nombres,
            correo: body.correo,
            password: body.password,//bcrypt.hashSync(body.password, 10),
            state: body.state,
            clusters: body.clusters, //.map(c => c.id),
            campaings: body.campaings,
            createdBy: body.createdBy,
            role: body.role

        })

        let data = await user.save()

        let userID = data._id
        
        for(let cluster of data.clusters){
            Cluster.updateMany({_id:cluster},{
                $addToSet: {
                    users: userID
                }
            },(err, data)=>{})
        }

        for(let campaing of data.campaings){
            Campaing.updateMany({_id:campaing},{
                $addToSet: {
                    users: userID
                }
            },(err, data)=>{})
        }
        //console.log("Usuario nuevo",userID)
        return res.json({
        
                    status: 200,
                    mensaje: "El Usuario ha sido creado con exito."
                
                })
    }catch(e){
        console.log(e)
        return res.json({

            Status: 400,
            mensaje: "El usuario no se ha podido guardar",
            error: e

            })
    }
}/* addUser */

/* PETICION GET PARA OBTENER LA LISTA DE TODOS LOS USUARIOS */
let getUsers = (req, res) =>{

    User.find({})
    .populate({path:"clusters", model:"Cluster"})
    .populate({path:"createdBy", model:"Administradores"})
    .exec((err, data) => {
    //Si hay un error en la Petición
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        User.countDocuments({}, (err, total) => {
            //Si hay un error en la Petición
            if(err){
                return res.json({
                    Status: 500,
                    Mensaje: "La petición no pudo ser completada."
                })
            }

            res.json({
                Status: 200,
                total,
                data
            })
        })
    })
}/* getUsers */

/* PETICIÓN GET PARA OBTENER LOS USUARIOS ASOCIADOS AL ADMINISTRADOR QUE LOS CREO */
let getAdminUsers = (req, res) =>{

    let id = req.params.id;

    User.find({"createdBy": id})
    .populate({path:"createdBy", model:"Administradores"})
    .populate({path:"clusters", model:"Cluster"})
    .populate({path:"campaings", model:"Campaing"})
    .exec((err, data) => {
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        User.countDocuments({}, (err, total) => {
            //Si hay un error en la Petición
            if(err){
                return res.json({
                    Status: 500,
                    Mensaje: "La petición no pudo ser completada."
                })
            }
            
            res.json({
                Status: 200,
                total,
                data
            })
        })
    })

}/* getAdminUsers */

/* PETICIÓN PARA OBTENER UN SOLO USUARIO(AUDITOR) */
let getUser = (req, res) =>{
    let id = req.params.id;

    User.find({"_id": id})
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
}/* getUser */

/* PETICIÓN PUT PARA EDITAR UN USUARIO */
let editUser = (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    //Buscamos el id que se pasas por parametro del documento a editar
    User.findById(id, (err, data) =>{

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
                mensaje: "El Usuario no existe en la BD",
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
                    password: previousPassword,
                    state: body.state,
                    role: body.role

                }
        
                User.findByIdAndUpdate(id, datosUser, {new: true, runValidators: true}, (err, data)=>{

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
                    mensaje: "El Usuario se ha actualizado con exito."
                })

            }).catch(respuesta =>{

                respuesta["res"].json({
                    status: 400,
                    data: respuesta["err"],
                    mensaje: "Error al editar el Usuario."
                })

            })
        }).catch(respuesta =>{

            respuesta["res"].json({
                status: 400,
                mensaje: respuesta["mensaje"]
            })

        })
    })
}/* editUser */

/* PETICIÓN DELETE PARA BORRAR UN USUARIO ESPECIFICO */
let deleteUser = (req, res) => {
    //capturamos el ID del Administrador a borrar
    let id = req.params.id;

    //Evitar borrar un unico administrador
    User.find({})
    .exec((err, data) => {
            //Buscamos el id que se pasa por parametro del documento a eliminar
            User.findById(id, (err, data) =>{

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
                        mensaje: "El Usuario no existe en la BD",
                        err 
                    }) 
                }

                //Borramos registro en BD
                User.findByIdAndRemove(id, (err, data) =>{
                    //Validamos que no ocurra error en el proceso
                    if(err){
                        return res.json({
                            status: 400,
                            mensaje: "Error al borrar el Usuario de la Colección",
                            err 
                        }) 
                    }

                    res.json({
                        status: 200,
                        mensaje: "El Usuario ha sido eliminado correctamente de la Colección"
                    })
                })
            })
        })

}/* deleteUser */

//FUNCION LOGIN PARA USUARIOS
let login = (req, res) =>{

    let body = req.body;

    User.findOne({correo: body.correo}, (err, data) =>{
    
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
                mensaje: "El Usuario es incorrecto",
                err 
            }) 
        }

        //if(!bcrypt.compareSync(body.password, data.password)){
        if(body.password != data.password){
            return res.json({
                status: 400,
                mensaje: "La contraseña es incorrecta",
                err 
            }) 
        }

        //console.log(body.password, body.correo)

        //Generar el token de Autorización
        let token = jwt.sign({
            data
        }, process.env.SECRET, {expiresIn: 10})

        res.json({
             status: 200,
             token,
             data
        })
    })
}

//EXPORTAMOS LAS FUNCIONES
module.exports = {addUser, getUser, getUsers, getAdminUsers, editUser, deleteUser, login}
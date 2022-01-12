/* Importamos el Modelo */
let SuperAdministrador = require('../modelos/superAdminModel');

/* PETICIONES PARA EL CRUD DE SUPER-ADMINISTRADORES */

/* PETICION POST PARA CREAR UN SUPER ADMINISTRADOR */
let addSuperAdmin = (req, res) =>{

    /* Obtenemos los datos del formulario */
    let body = req.body;

    let superAdmin = new SuperAdministrador({

        nombres: body.nombres,
        correo: body.correo,
        role: body.role,
        password: body.password,
        state: body.state

    })

    /* Guardamos en BD */
    superAdmin.save((err, data) => {
        
        if(err){

            return res.json({

                Status: 400,
                mensaje: "Error al crear el Super-Administrador",
                err
                
            })
        }
                        
        res.json({
        
            status: 200,
            data,
            mensaje: "El Super-Administrador ha sido creado con exito."
        
        })
    })
}/* addSuperAdmin */

/* PETICION GET PARA OBTENER TODOS LOS SUPER-ADMINISTRADORES */
let getAllSuperAdmins = (req, res) =>{

    SuperAdministrador.find({})
    .exec((err, data) => {
        //Si hay un error en la Petición
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        SuperAdministrador.countDocuments({}, (err, total) => {
            //Si hay un error en la Petición
            if(err){
                return res.json({
                    Status: 500,
                    Mensaje: "La petición no pudo ser completada."
                })
            }
            
            res.json({
                Status: 200,
                mensaje: "Super-Administradores",
                total,
                data
            })
        })
    })
}/* getAllSuperAdmins */

/* PETICION PARA EDITAR UN SUPER-ADMINISTRADOR */
let editSuperAdmin = (req, res) =>{
    /* Obtenemos el id del Super-Administrador a Editar y los datos del formulario */
    let id = req.params.id;
    let body = req.body;

    /* Buscamos el documento por ID */
    SuperAdministrador.findById(id, (err, data) =>{

        /* Si hay Error en la petición */
        if(err){
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err 
            })
        }

        /* Validamos que el Super-Administrador exista */
        if(!data){
            return res.json({
                status: 400,
                mensaje: "El Super-Administrador no existe en la BD",
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

        /* actualizamos los datos */
        let guardarCambiosBD = (id, body, previousPassword) =>{

            return new Promise((resolve, reject) =>{

                let datosSuperAdmin = {
                  
                    nombres: body.nombres,
                    correo: body.correo,
                    role: body.role,
                    password: previousPassword,
                    state: body.state

                }
        
                SuperAdministrador.findByIdAndUpdate(id, datosSuperAdmin, {new: true, runValidators: true}, (err, data)=>{

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
                    mensaje: "El Super-Administrador se ha actualizado con exito."
                })

            }).catch(respuesta =>{

                respuesta["res"].json({
                    status: 400,
                    data: respuesta["err"],
                    mensaje: "Error al editar el Super-Administrador."
                })

            })
        }).catch(respuesta =>{

            respuesta["res"].json({
                status: 400,
                mensaje: respuesta["mensaje"]
            })

        })
    })
}

/* PETICION PARA ELIMINAR UN SUPER-ADMINISTRADOR */
let deleteSuperAdmin = (req, res) =>{

    /* capturamos el ID del Administrador a borrar */
    let id = req.params.id;

    /*  */
    SuperAdministrador.find({})
    .exec((err, data) => {
            //Buscamos el id que se pasa por parametro del documento a eliminar
            SuperAdministrador.findById(id, (err, data) =>{ 

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
                        mensaje: "El Super-Administrador no existe en la BD",
                        err 
                    }) 
                }

                //Borramos registro en BD
                SuperAdministrador.findByIdAndRemove(id, (err, data) =>{
                    //Validamos que no ocurra error en el proceso
                    if(err){
                        return res.json({
                            status: 400,
                            mensaje: "Error al borrar el Super-Administrador de la Colección",
                            err 
                        }) 
                    }

                    res.json({
                        status: 200,
                        data,
                        mensaje: "El Super-Administrador ha sido eliminado correctamente de la Colección"
                    })
                })
            })
    })
}

module.exports = {addSuperAdmin, getAllSuperAdmins, editSuperAdmin, deleteSuperAdmin}
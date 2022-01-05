//Importar el modelo
let Cluster = require('../modelos/clusterModel');
let Administrador = require('../modelos/adminModel');


let fs = require('fs');
const path = require('path');

//PETICIÓN POST PARA CREAR UN NUEVO CLUSTER
let addCluster = async (req, res) =>{
    
    try {
         //Obtener el cuerpo del Formulario para el modelo de Modulo
       let body = req.body;

       //Preguntamos si viene un archivo de imagen
       if(!req.files){

            return res.json({
                status: 500,
                mensaje: "La imagen no puede ir vacia"
            })
       }

       //Capturamos el archivo de imagen
       let foto = req.files.foto;
       
       //Validamos la extención de la imagen
       if(foto.mimetype != 'image/jpeg' && foto.mimetype != 'image/png'){

            return res.json({
                status: 500,
                mensaje: "El tipo de Imagen no puede ser diferente de jpeg o png."
            })
       }

        //Validamos el tamaño de la imagen
        if(foto.size > 10000000){

            return res.json({
                status: 500,
                mensaje: "El tamaño de la imagen no puede ser mayor a 4Mb."
            })
        }

        //Cambiar el nombre de la foto que se esta cargando
        let nuevoNombre = Math.floor(Math.random() * 10000);
        
        //Capturamos la extención del archivo
        let extension = foto.name.split('.').pop();
        
        //Movemos la foto a la carpeta
        foto.mv(`./imagenes/clustersimg/${nuevoNombre}.${extension}`, err => {

            if(err){
                return res.json({
                    status: 500,
                    mensaje: "Error al guardar la imagen",
                    err
                })
            }

            //Creamos un nuevo objeto para el modelo de Cluster y obtenemos los parametros
            let cluster = new Cluster({

                nombre: body.nombre,
                foto: `${nuevoNombre}.${extension}`,
                state: body.state,
                createdBy: body.createdBy,
                users: JSON.parse(body.users)

            })


            //Guardamos en BD
            cluster.save((err, data) => {
        
                if(err){

                    return res.json({

                     Status: 400,
                        mensaje: "Error al guardar el Cluster.",
                        err
                    })
                }
                            
                res.json({
            
                    status: 200,
                    data,
                    mensaje: "El cluster ha sido creado con exito."
            
                })
            
            })

        });
    } catch (error) {

        return res.json({

            Status: 400,
               mensaje: "Error al guardar el Cluster.",
               err: error
           })
    }
      
}//POST

//PETICIÓN GET PARA OBTENER TODOS LOS CLUSTERS
let getClusters = (req, res) =>{

    Cluster.find({})
    .populate({path:"users", model:"Administradores"})
    .exec((err, data) => {
        //Si hay un error en la Petición
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        Cluster.countDocuments({}, (err, total) => {
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
}//GET

//PETICIÓN GET PARA OBTENER TODOS LOS CLUSTERS ASOCIADOS A UN ADMINISTRADOR
let getAdminClusters = (req, res) =>{

    let id = req.params.id;

    Cluster.find({"createdBy": id})
    .populate({path:"createdBy", model:"Administradores"})
    .populate({path:"users", model:"User"})
    .exec((err, data) => {
        //Si hay un error en la Petición
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        Cluster.countDocuments({}, (err, total) => {
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
}//GET

//PETICIÓN GET PARA OBTENER LOS CLUSTERS ASOCIADOS A UN AUDITOR
let getSingleCluster = (req, res) =>{

    let id = req.params.id;

    Cluster.find({"users": id})
    .populate({path:"users", model:"Administradores"})
    .populate({path:"users", model:"User"})
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

}//GETSINGLE

//PETICIÓN PUT PARA EDITAR UN CLUSTER
let editCluster = (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    //Buscamos el id que se pasas por parametro del documento a editar
    Cluster.findById(id, (err, data) =>{

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
                mensaje: "El Cluster no existe en la BD",
            }) 
        }

        let rutaImagen = data.foto;

        //Validamos cambio de imagen
        let validarCambioImagen = (req, rutaImagen) =>{

            return new Promise((resolve, reject) =>{
                
                if(req.files){

                    //Capturamos el archivo de imagen
                    let foto = req.files.foto;
                    
                    //Validamos la extención de la imagen
                    if(foto.mimetype != 'image/jpeg' && foto.mimetype != 'image/png'){

                        let respuesta = {
                            res: res,
                            mensaje: "El tipo de Imagen no puede ser diferente de jpeg o png."
                        }

                        reject(respuesta);
                    }

                    //Validamos el tamaño de la imagen
                    if(foto.size > 10000000){

                        let respuesta = {
                            res: res,
                            mensaje: "El tamaño de la imagen no puede ser mayor a 4Mb."
                        }

                        reject(respuesta);
                    }

                    //Cambiar el nombre de la foto que se esta cargando
                    let nuevoNombre = Math.floor(Math.random() * 10000);
                        
                    //Capturamos la extención del archivo
                    let extension = foto.name.split('.').pop();

                    //Movemos la foto a la carpeta
                    foto.mv(`./imagenes/clustersimg/${nuevoNombre}.${extension}`, err => {

                        if(err){

                            let respuesta = {
                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }
    
                            reject(respuesta);
                        }

                        //Borramos la imagen antigua
                        if(fs.existsSync(`./imagenes/clustersimg/${rutaImagen}`)){

                            fs.unlinkSync(`./imagenes/clustersimg/${rutaImagen}`);
                        }


                        //Se le asigan el nuevo nombre a la imagen
                        rutaImagen = `${nuevoNombre}.${extension}`;
                        resolve(rutaImagen);
                    });

                }else{

                    resolve(rutaImagen);

                }
            })
        }

        //actualizamos los datos en BD
        let cambiarRegistrosBD = (id, body, rutaImagen) =>{

            return new Promise((resolve, reject) =>{

                let datosCluster = {

                    nombre: body.nombre,
                    foto: rutaImagen,
                    state: body.state,
                    users: JSON.parse(body.users)
        
                }
        
                Cluster.findByIdAndUpdate(id, datosCluster, {new: true, runValidators: true}, (err, data)=>{
                    if(err){

                        let respuesta ={
                            res: res,
                            error: err
                        }

                        reject(respuesta);

                    }

                    let respuesta ={
                        res: res,
                        data: data
                    }

                    resolve(respuesta);
                })
            })
        }

        //Sincronizamos las Promesas
        validarCambioImagen(req, rutaImagen).then(rutaImagen =>{
            cambiarRegistrosBD(id, body, rutaImagen).then(respuesta =>{

                respuesta["res"].json({
                    status: 200,
                    data: respuesta["data"],
                    mensaje: "El cluster se ha actualizado con exito."
                })

            }).catch(respuesta => {

                respuesta["res"].json({
                    status: 400,
                    data: respuesta["err"],
                    mensaje: "Error al editar el Cluster."
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

//PETICIÓN DELETE PARA ELIMINAR UN CLUSTER ESPECIFICO
let deleteCluster = (req, res) => {
    
    //capturamos el ID del Cluster a borrar
    let id = req.params.id;

    //Buscamos el id que se pasa por parametro del documento a eliminar
    Cluster.findById(id, (err, data) =>{

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
                mensaje: "El Cluster no existe en la BD",
                err 
            }) 
        }

        
        //Borramos la imagen antigua
        if(fs.existsSync(`./imagenes/clustersimg/${data.foto}`)){

            fs.unlinkSync(`./imagenes/clustersimg/${data.foto}`);

        }

        //Borramos registro en BD
        Cluster.findByIdAndRemove(id, (err, data) =>{
            //Validamos que no ocurra error en el proceso
            if(err){
                return res.json({
                    status: 400,
                    mensaje: "Error al Borrar el cluster de BD",
                    err 
                }) 
            }

            res.json({
                status: 200,
                mensaje: "El Cluster ha sido eliminado correctamente de la BD"
            })
        })

    })

}//DELETE

//PETICIÓN PARA ACCEDER A LA IMAGEN DE UNA CAMPAÑA
let getClusterImg = (req, res) =>{
    
    let foto = req.params.foto;
	let rutaFoto = `./imagenes/clustersimg/${foto}`;

    fs.exists(rutaFoto, exists=>{

		if(!exists){

			return res.json({
				status:400,
				mensaje: "La foto no existe"
			})

		}

		res.sendFile(path.resolve(rutaFoto));
        
	})

}//GET


//EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
module.exports = {addCluster, getClusters, getClusterImg, getSingleCluster, getAdminClusters, editCluster, deleteCluster}
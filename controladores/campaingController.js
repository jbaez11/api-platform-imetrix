//Importar el modelo
let Campaing = require('../modelos/campaingModel');

let fs = require('fs');
const path = require('path');

/* PETICIÓN POST PARA CREAR UNA CAMPAÑA */
let addCampaing = (req, res) =>{

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

        foto.mv(`./imagenes/campaingsimg/${nuevoNombre}.${extension}`, err => {

            if(err){
                return res.json({
                    status: 500,
                    mensaje: "Error al guardar la imagen",
                    err
                })
            }

            //Creamos un nuevo objeto para el modelo de Cluster y obtenemos los parametros
            let campaing = new Campaing({

                nombre: body.nombre,
                foto: `${nuevoNombre}.${extension}`,
                state: body.state,
                cluster: body.cluster,
                users: body.users,
                pais: body.pais

            })

            //Guardamos en BD
            campaing.save((err, data) => {
        
                if(err){

                    return res.json({

                        status: 400,
                        mensaje: "Error al guardar la campaña.",
                        err
                    })
                }
                            
                res.json({
                
                    status: 200,
                    data,
                    mensaje: "La campaña ha sido creada con exito."
                
                })
            
            })

        });
}/* addCampaing */

/* PETICION PARA OBTENER TODAS LAS CAMPAÑAS */
let getCampaings = (req, res) =>{

    Campaing.find({})
    .populate({path:"cluster", model:"Cluster"})
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
        Campaing.countDocuments({}, (err, total) => {
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
}/* getCampaings */

/* PETECIÓN GET PARA OBTENER LAS CAMPAÑAS ASOCIADAS A UN CLUSTER ESPECIFICO */
let getCampaingCluster = (req, res) =>{

    let id = req.params.id;
    Campaing.find({"cluster": id})
    .populate({path:"cluster", model:"Cluster"})
    .exec((err, data) => {
        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        //Contar la cantidad de documentos dentro de la colección
        Campaing.countDocuments({}, (err, total) => {
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

}/* getCampaingCluster */

/* PETICION PARA OBTNER LAS CAMPAÑAS QUE ESTAN ASOCIADAS A UN AUDITOR ESPECIFICO */
let getCampaingUser = (req, res) =>{
    
    let id = req.params.id;

    Campaing.find({"users": id})
    .populate({path:"users", model:"User"})
    .exec((err, data) =>{

        if(err){
            return res.json({
                Status: 500,
                Mensaje: "La petición no pudo ser completada."
            })
        }
        res.json({
            Status: 200,
            Mensaje: "Campañas asociadas al Usuario",
            data
        })
    })     
}/* getCampaingUser */

/* PETICIÓN PUT PARA EDITAR UNA CAMPAÑA EN ESPECIFICO */
let editCampaing = (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    //Buscamos el id que se pasas por parametro del documento a editar
    Campaing.findById(id, (err, data) =>{

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
                mensaje: "La campaña no existe en la BD",
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
                    foto.mv(`./imagenes/campaingsimg/${nuevoNombre}.${extension}`, err => {

                        if(err){

                            let respuesta = {
                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }
    
                            reject(respuesta);
                        }

                        //Borramos la imagen antigua
                        if(fs.existsSync(`./imagenes/campaingsimg/${rutaImagen}`)){

                            fs.unlinkSync(`./imagenes/campaingsimg/${rutaImagen}`);
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

            return new Promise((resolve, reject) => {

                let datosCampaing = {

                    nombre: body.nombre,
                    foto: rutaImagen,
                    state: body.state,
                    cluster: body.cluster,
                    users: body.users,
                    pais: body.pais
        
                }
        
                Campaing.findByIdAndUpdate(id, datosCampaing, {new: true, runValidators: true}, (err, data)=>{
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
                    mensaje: "La campaña se ha actualizado con exito."
                })

            }).catch(respuesta =>{

                respuesta["res"].json({
                    status: 400,
                    data: respuesta["err"],
                    mensaje: "Error al editar la Campaña!!!!."
                })

            })
        }).catch(respuesta =>{

            respuesta["res"].json({
                status: 400,
                mensaje: respuesta["mensaje"]
            })
        })
    })
}/* editCampaing */

/* PETICIÓN PARA ELIMINAR UNA CAMPAÑA EN ESPECIFICO */
let deleteCampaing = (req, res) => {
    
    //capturamos el ID del Cluster a borrar
    let id = req.params.id;

    //Buscamos el id que se pasa por parametro del documento a eliminar
    Campaing.findById(id, (err, data) =>{

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
                mensaje: "La campaña no existe en la BD",
                err 
            }) 
        }

        //Borramos la imagen antigua
        if(fs.existsSync(`./imagenes/campaingsimg/${data.foto}`)){

            fs.unlinkSync(`./imagenes/campaingsimg/${data.foto}`);

        }

        //Borramos registro en BD
        Campaing.findByIdAndRemove(id, (err, data) =>{
            //Validamos que no ocurra un error en el proceso
            if(err){
                return res.json({
                    status: 400,
                    mensaje: "Error al Borrar la campaña de la colección",
                    err 
                }) 
            }

            res.json({
                status: 200,
                data,
                mensaje: "La campaña ha sido eliminada correctamente de la colección"
            })
        })

    })

}/* deleteCampaing */

/* PETICIÓN PARA ACCEDER A LA IMAGEN DE UNA CAMPAÑA */
let getCampaingImg = (req, res) =>{
    
    let foto = req.params.foto;
	let rutaFoto = `./imagenes/campaingsimg/${foto}`;

    fs.exists(rutaFoto, exists=>{

		if(!exists){

			return res.json({
				status:400,
				mensaje: "La foto no existe"
			})

		}

		res.sendFile(path.resolve(rutaFoto));
        
	})

}/* getCampaingImg */

/* Exportar las funciones del controlador */
module.exports = {addCampaing, getCampaings, getCampaingUser, getCampaingCluster, editCampaing, deleteCampaing, getCampaingImg}
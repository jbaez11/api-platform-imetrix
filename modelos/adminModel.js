const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let adminSchema = new Schema({

    nombres:{
        type: String,
        required: [true, "Los nombres son Obligatorios."]
    },
    correo:{
        type: String,
        required: [true, "El correo es obligatorio."],
        unique: true
    },
    telefono:{
        type: String,
        required: [false, "El telefono es Obligatorio."],
        unique: true
    },
    cedula:{
        type: String,
        required: [true, "La cedula es Obligatoria"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "La contraseña es obligatoria."]
    },
    role:{
        type: String,
        required: [true, "El rol es Obligatorio."]
    },
    clusters:[
        {type: Schema.Types.ObjectId, ref: 'Cluster', required: [false, "El cluster es obligatorio."]}
    ],
    state:{
        type: Number,
        required: [true, "El estado del usuario es obligatorio."]
    },
    nombreEmpresa:{
        type: String,
        required: [true, "El nombre de la Empresa es Obligatorio."],
        unique: true
    },
    pais:{
        type: String,
        required: [true, "El Pais es Obligatorio."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

// //EVITAR MOSTRAR EL CAMPO PASSWORD EN EL JSON DE RESPUESTA PARA EL METODO GET
// adminSchema.methods.toJSON = function(){
    
//     let administrador = this;
//     let adminObject = administrador.toObject();
//     delete adminObject.password;

//     return adminObject;

// }

module.exports = mongoose.model("Administradores", adminSchema);
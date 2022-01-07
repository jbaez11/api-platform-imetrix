const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({

    nombres:{
        type: String,
        required: [true, "Los nombres son Obligatorios."]
    },
    correo:{
        type: String,
        required: [true, "El correo es obligatorio."],
        unique: true
    },
    password:{
        type: String,
        required: [true, "La contraseña es obligatoria."]
    },
    state:{
        type: Number,
        required: [true, "El estado del usuario es obligatorio."]
    },
    clusters:[
        {type: Schema.Types.ObjectId, 
            ref: 'Cluster'}
    ],
    campaings:[
        {type: Schema.Types.ObjectId, 
            ref: 'Campaing'}
    ],
    createdBy:{
        type: Schema.Types.ObjectId, 
        ref: 'Administradores', 
        required: [false, "El Administrador que lo creo obligatorio."]
    },
    role:{
        type: String,
        required: [true, "El rol es Obligatorio."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

// //EVITAR MOSTRAR EL CAMPO PASSWORD EN EL JSON DE RESPUESTA PARA EL METODO GET
// userSchema.methods.toJSON = function(){
    
//     let administrador = this;
//     let adminObject = administrador.toObject();
//     delete adminObject.password;

//     return adminObject;

// }

module.exports = mongoose.model("User", userSchema);
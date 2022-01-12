const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let superAdminSchema = new Schema({

    nombres:{
        type: String,
        required: [true, "Los nombres son Obligatorios."]
    },
    correo:{
        type: String,
        required: [true, "El correo es obligatorio."],
        unique: true
    },
    role:{
        type: String,
        required: [true, "El rol es Obligatorio."]
    },
    password:{
        type: String,
        required: [true, "La contraseña es obligatoria."]
    },
    state:{
        type: Number,
        required: [true, "El estado del usuario es obligatorio."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

module.exports = mongoose.model("SuperAdministradores", superAdminSchema);
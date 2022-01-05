const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let clusterSchema = new Schema({

    nombre:{
        type: String,
        required: [true, "El nombre del Cluster es obligatorio."],
        uppercase: true
    },
    foto:{
        type: String,
        required: [true, "La foto es obligatoria."]
    },
    state:{
        type: Number,
        required: [true, "El estado del cluster es obligatorio."]
    },
    createdBy:{
        type: Schema.Types.ObjectId, 
        ref: 'Administradores', 
        required: [false, "El usuario que lo creo obligatorio."],
        unique: false
    },
    users:[
        {type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: [false, "El usuario es obligatorio."], 
            unique: false} 
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

module.exports = mongoose.model("Cluster", clusterSchema);
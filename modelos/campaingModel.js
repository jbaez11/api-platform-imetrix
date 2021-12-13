const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let campaingSchema = new Schema({

    nombre:{
        type: String,
        required: [true, "El nombre de la campaña es obligatorio."]
    },
    foto:{
        type: String,
        required: [true, "La foto es obligatoria."]
    },
    state:{
        type: Number,
        required: [true, "El estado de la campaña es obligatorio."]
    },
    cluster:{
        type: Schema.Types.ObjectId, 
        ref: 'Cluster', 
        required: [true, "El cluster es obligatorio."]
    },
    users:[
        {type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: [false, "El usuario es obligatorio."]} 
    ],
    pais:{
        type: String,
        required: [true, "El Pais es Obligatorio."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

module.exports = mongoose.model("Campaing", campaingSchema);
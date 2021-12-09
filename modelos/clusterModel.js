const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let clusterSchema = new Schema({

    nombre:{
        type: String,
        required: [true, "El nombre del Cluster es obligatorio."]
    },
    foto:{
        type: String,
        required: [true, "La foto es obligatoria."]
    },
    state:{
        type: Number,
        required: [true, "El estado del cluster es obligatorio."]
    },
    users:[
        {type: Schema.Types.ObjectId, ref: 'User', required: [false, "El usuario es obligatorio."], unique: false} 
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

module.exports = mongoose.model("Cluster", clusterSchema);
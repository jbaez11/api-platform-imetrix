//Variables para conexión y peticiones
const express = require('express');
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require('cors');
require("dotenv").config();


const app = express();
const port = process.env.PORT || 4000;


//MIDDLEWARE PARA BODY PARSER
app.use(express.json());
app.use(cors());


//MIDDLEWARE PARA FILEUPLOAD
app.use(fileUpload());

//Importar la rutas que se van a utilizar
app.use(require('./rutas/clusterRoute'));
app.use(require('./rutas/campaingRoute'));
app.use(require('./rutas/userRoute'));
app.use(require('./rutas/adminRoute'));


//MogoDB Connection
mongoose
.connect(process.env.MONGODB_URI)
.then(()=> console.log("Connected to MongoDB Atlas - Roles"))
.catch((error) => console.error(error));

//Muestra el puerto por el cual esta conectado
app.listen(port, () => console.log('Server active in port', port));


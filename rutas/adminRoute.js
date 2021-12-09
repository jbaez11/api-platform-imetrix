const express = require('express');
const app = express();

/* Importar controlador que tiene las peticiones POST-PUT-DELETE-GET etc. */
const Admin= require('../controladores/adminController');

/* Importamos el MiddleWare para validar el token de Sesión */
const {verificarToken} = require('../middleware/autenticacion');

/* Creamos las rutas con el tipo de petición a ejecutar en la API */
app.post('/addAdmin', Admin.addAdmin);
app.get('/getAdmin/:id', Admin.getAdmin);
app.post('/loginAdmin', Admin.loginAdmin);
app.delete('/deleteAdmin/:id', Admin.deleteAdmin);
app.put('/editAdmin/:id', verificarToken, Admin.editAdmin);

//Exportar la Ruta
module.exports = app;
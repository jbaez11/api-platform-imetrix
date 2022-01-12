const express = require('express');
const app = express();

/* Importar controlador que tiene las peticiones POST-PUT-DELETE-GET etc. */
const SuperAdmin= require('../controladores/superAdminController');

/* Creamos las rutas con el tipo de petición a ejecutar en la API */
app.post('/addSuperAdmin', SuperAdmin.addSuperAdmin);
app.get('/getAllSuperAdmins', SuperAdmin.getAllSuperAdmins);
app.put('/editSuperAdmin/:id', SuperAdmin.editSuperAdmin);
app.delete('/deleteSuperAdmin/:id', SuperAdmin.deleteSuperAdmin);

/* Exportar las rutas */
module.exports = app;
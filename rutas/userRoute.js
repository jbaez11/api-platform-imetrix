const express = require('express');
const app = express();
//Importar controlador
const User= require('../controladores/userController');
//Importamos el MiddleWare
const {verificarToken} = require('../middleware/autenticacion');

//Crear la ruta HTTP para la petición
app.post('/addUser', verificarToken, User.addUser);
app.get('/getUserProfile/:id', User.getUser);
app.get('/getUser/:id', User.getAdminUsers);
app.put('/editUser/:id', verificarToken, User.editUser);
app.delete('/deleteUser/:id', verificarToken, User.deleteUser);
app.post('/loginUser', User.login);

//Exportar la Ruta
module.exports = app;
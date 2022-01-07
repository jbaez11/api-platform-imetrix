const express = require('express');
const app = express();
//Importar controlador
const Campaing= require('../controladores/campaingController');
//Importamos el MiddleWare
const {verificarToken} = require('../middleware/autenticacion');

//Crear la ruta HTTP para la petición
app.post('/addCampaing', verificarToken, Campaing.addCampaing);
app.get('/getCampaings', Campaing.getCampaings);
app.get('/getCampaing/:id', Campaing.getCampaingCluster);
app.get('/getUserCampaing/:id', Campaing.getSingleCampaing);
app.get('/getImgCampaing/:foto', Campaing.getCampaingImg);
app.get('/getCampaingUser/:id/:cluster', Campaing.getCampaingUser);
app.put('/editCampaing/:id', verificarToken, Campaing.editCampaing);
app.delete('/deleteCampaing/:id', verificarToken, Campaing.deleteCampaing);

//Exportar la Ruta
module.exports = app;
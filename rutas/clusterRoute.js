const express = require('express');
const app = express();
//Importar controlador
const Cluster= require('../controladores/clusterController');
//Importamos el MiddleWare
const {verificarToken} = require('../middleware/autenticacion');

//Crear la ruta HTTP para la petición
app.post('/addCluster', verificarToken, Cluster.addCluster);
app.get('/getClusters', Cluster.getClusters);
app.get('/getCluster/:id', Cluster.getSingleCluster);
app.get('/getImgCluster/:foto', Cluster.getClusterImg);
app.put('/editCluster/:id', verificarToken, Cluster.editCluster);
app.delete('/deleteCluster/:id', verificarToken, Cluster.deleteCluster);

//Exportamos las Rutas
module.exports = app;
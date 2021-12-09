const jwt = require('jsonwebtoken');

//Verificar el Token
let verificarToken = (req, res, next) =>{

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET, (err, decoded) =>{

        if(err){

            return res.json({
                status : 401,
                mensaje : "El token de autorización no es valido"
            })
        }

        req.user = decoded.user;

        next();
    })
}

module.exports = {verificarToken}
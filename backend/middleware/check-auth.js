const jwt = require('jsonwebtoken');

// Ce middleware va checker le token
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
        // Une fois le token decodé (accès au payload (userId, email))
        // On peut rajouter une nouvelle donnée dans la requête avant de l'envoyer
        // Aini toutes les routes utilisant ce middleware aurons accès à ces infos
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();
    }catch{
        res.status(401).json({
            message: "Error token, auth failed"
        })
    }
}
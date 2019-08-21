const jwt = require('jsonwebtoken');

// Ce middleware va checker le token
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'secret_this_should_be_longer');
        next();
    }catch{
        res.status(401).json({
            message: "Error token, auth failed"
        })
    }
}
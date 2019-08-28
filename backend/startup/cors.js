
module.exports = (req, res, next) => {
    // On configure notre backend pour la gestion des requêtes du front
    // On utilise ce middleware avant toutes routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        "Origin, W-Request-Width, Content-type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
}
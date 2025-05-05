module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        // Guarda la URL que el usuario intentó visitar
        req.session.returnTo = req.originalUrl; // <-- ESTA LÍNEA ES CLAVE
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

// NUEVO MIDDLEWARE: guarda el returnTo en res.locals
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

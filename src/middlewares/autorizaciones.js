
export function soloLogueadosApi(req, res, next) {
    if (!req.isAuthenticated()) {
        return res
            .status(403)
            .json({ status: 'error', message: 'necesita iniciar sesion' });
    }
    next();
}

export function autorizacionUsuario(req, res, next) {
    if(!req.user){
        return res.redirect('/login'); 
    }
  
    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}

export function autorizacionAdmin(req, res, next) {
    if(!req.user){
        return res.redirect('/login'); 
    }   
    if (req.user.rol == 'admin') {
        next();
    } else {
        res.send('acceso denegado');
    }
}
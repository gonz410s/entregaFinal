
export function vistaRegistro(req, res) {
    res.render('register.handlebars', {
        pageTitle: 'Registro',
    });
}

export function vistaResetPassword(req, res) {
    res.render('resetpassword.handlebars', {
        pageTitle: 'Reestablecer contraseña',
    });
}

export function editUser(req, res) {
    res.render('edit.handlebars', {
        pageTitle: 'Editar mis datos',
    });
}

export function vistasProfile(req, res) {
    res.render('profile.handlebars', {
        pageTitle: 'Perfil',
        user: req.user,
    });
}

export function vistasAdmin(req, res) {
    res.render('admin.handlebars', {
        pageTitle: 'Administrador',
    });
}

export async function vistaReset(req, res) {
    try {
        const dato = encodeURIComponent(req.params.token);
        res.render('reset.handlebars', {
            pageTitle: 'Reestablecer contraseña',
            decodedToken: dato
        });
    } catch (error) {}
}
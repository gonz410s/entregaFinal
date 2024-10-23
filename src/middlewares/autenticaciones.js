
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { usuariosService } from '../services/usuarios.service.js';
import { TIPOS_ERROR } from '../utils/EError.js';
TIPOS_ERROR;
import {MONGODB_CNX_STR, JWT_SECRET } from '../config.js'
import { logger } from '../utils/logger.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// Estrategia de Login Local
passport.use(
    'loginLocal',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async function verificationCallback(username, password, done) {
            try {
                const datosUsuario = await usuariosService.login(username, password);
                done(null, datosUsuario);
            } catch (error) {
                done(error);
            }
        }
    )
);

// Estrategia JWT
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await usuariosService.findById(jwt_payload.id); // Cambia esto según tu implementación
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

// Serialización y deserialización
passport.serializeUser((user, next) => {
    next(null, user);
});
passport.deserializeUser((user, next) => {
    next(null, user);
});

// Middleware de Inicialización de Passport y Sesiones
export const passportInitialize = passport.initialize();
export const passportSession = passport.session();

// Middleware para verificar si el usuario está autenticado (API)
export function soloLogueadosApi(req, res, next) {
    if (!req.isAuthenticated()) {
        return res
            .status(403)
            .json({ status: 'error', message: 'necesita iniciar sesion' });
    }
    next();
}

// Middleware de autorización
export function autorizacionUsuario(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}

export function autorizacionAdmin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    if (req.user.rol === 'admin') {
        next();
    } else {
        res.send('acceso denegado');
    }
}


import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { usuariosService } from '../services/usuarios.service.js';

import jwt from 'jsonwebtoken';

const JWT_SECRET = 'millave'; 
// Passport Local Strategy
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

passport.serializeUser((user, next) => {
    next(null, user);
});
passport.deserializeUser((user, next) => {
    next(null, user);
});

// Generar JWT
export const generateToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); 
};

// Middleware para verificar JWT
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(403).send('Token no proporcionado.');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token no válido.');
        req.user = decoded;
        next();
    });
};

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();

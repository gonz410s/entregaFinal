
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { usuariosService } from '../services/usuarios.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
TIPOS_ERROR;

import { logger } from '../utils/logger.js';

passport.use(
    'loginLocal',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async function verificationCallback(username, password, done) {
            try {
                const datosUsuario = await usuariosService.login(
                    username,
                    password
                );
              
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

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
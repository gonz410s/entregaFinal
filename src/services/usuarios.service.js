
import { getDaoUsuarios } from '../dao/usuarios/usuarios.dao.js';
import { CustomError } from '../utils/CustomErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { hasheadasSonIguales, hashear } from '../utils/criptografia.js';
import { logger } from '../utils/logger.js';

const usuariosDao = getDaoUsuarios();

class UsuariosService {
    async createUsuario(newUser) {
        return await usuariosDao.createUsuario(newUser);
    }

    async findOneUser(datos) {
        try {
            const usuariogit = await usuariosDao.findOneUser(datos);
            const usuario = usuariogit[0];

            const datosUsuario = {
                email: usuario['email'],
                nombre: usuario['nombre'],
                apellido: usuario['apellido'],
                rol: usuario['rol'],
            };

            return datosUsuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }
    async findOneUserMongo(datos) {
        try {
            const usuarioMongo = await usuariosDao.findOneUserMongo(datos);
            return usuarioMongo;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async findOneUserTokenMongo(decodedToken) {
        try {
            const usuario = await usuariosDao.findOneUserMongo({
                resetPasswordToken: decodedToken,
                resetPasswordExpires: { $gt: Date.now() },
            });
            return usuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async login(email, password) {
        let datosUsuario;
        try {
            if (email === 'adminCoder@coder.com' && password === '1234') {
                datosUsuario = {
                    email: 'admin',
                    nombre: 'admin',
                    apellido: 'admin',
                    rol: 'admin',
                };
            } else {
                const usuario = await usuariosDao.login(email);

                if (!usuario) {
                    throw CustomError.createError(
                        'UsuarioNoEncontrado',
                        null,
                        'No se encontró un usuario con ese correo electrónico.',
                        TIPOS_ERROR.NOT_FOUND
                    );
                }

                if (!hasheadasSonIguales(password, usuario['password'])) {
                    logger.error(`Error durante la autenticación local`);
                    throw CustomError.createError(
                        'AutenticacionFallida',
                        null,
                        'La contraseña es incorrecta.',
                        TIPOS_ERROR.AUTENTICATION
                    );
                }

                datosUsuario = {
                    email: usuario['email'],
                    nombre: usuario['nombre'],
                    apellido: usuario['apellido'],
                    rol: 'usuario',
                };
            }
            return datosUsuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async findOneAndUpdate(datos) {
        try {
            const usuarioActualizado = await usuariosDao.findOneAndUpdate(
                datos
            );

            return usuarioActualizado;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async findByIdAndUpdate(datos, newPassword) {
        return await usuariosDao.findByIdAndUpdate(datos, newPassword);
    }

    async newPassword(data, user) {
        if (data.password1 !== data.password2) {
            return { error: true, code: 'PASSWORDS_DO_NOT_MATCH' };
        }

        const passCript = hashear(data.password1);

        if (hasheadasSonIguales(data.password1, user.password)) {
        
            return { error: true, code: 'PASSWORDS_ARE_SAME' };
        }

        const userActualizado = await this.findByIdAndUpdate(
            user._id,
            passCript
        );

        return data.password1;
    }

    async updateRol(email, rol) {
        if (rol === 'usuario') {
            const usuario = await usuariosDao.userPremium(email);
            return usuario;
        } else {
            const usuario = await usuariosDao.userUsuario(email);
            return usuario;
        }
    }
}

export const usuariosService = new UsuariosService();
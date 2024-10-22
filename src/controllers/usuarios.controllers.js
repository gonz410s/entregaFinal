
import { transport } from '../config.js';
import { usuariosService } from '../services/usuarios.service.js';
import { hashear } from '../utils/criptografia.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcrypt';

export async function crearUsuario(req, res, next) {
    try {
        req.body.password = hashear(req.body.password);
        const usuario = await usuariosService.createUsuario(req.body);
        req.login(usuario, (error) => {
            if (error) {
                res.status(401).json({
                    status: 'error',
                    message: error.message,
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    payload: usuario,
                });
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

export async function getUserLogeado(req, res, next) {
    try {
        const usuario = await usuariosService.findOneUser(
            { email: req['user'].email },
            { password: 0 }
        );

        res.json({ status: 'success', payload: usuario });
    } catch (error) {
        next(error);
    }
}

export async function editUser(req, res, next) {
    try {
        const mail = req.body.email;

        const usuario = await usuariosService.findOneUserMongo({ email: mail });

        if (!usuario) {
            return next(
                CustomError.createError(
                    `no hay usuario registrado con ese mail`,
                    null,
                    `no hay usuario registrado con ese mail`,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        // Generar token seguro con bcrypt
        const token = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                }
                bcrypt.hash(mail, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        });
        const encodedToken = encodeURIComponent(token);

        // Establecer token y tiempo de expiración
        const expiration = Date.now() + 3600000; // 1 hora
        usuario.resetPasswordToken = encodedToken;
        usuario.resetPasswordExpires = expiration;

        await usuario.save();
        const mailOptions = {
            from: '<joaquin.ariel.lopez.98@gmail.com>',
            to: mail,
            subject: 'Restablecimiento de Contraseña',
            text: `Recibes este correo porque  ha solicitado el restablecimiento de la contraseña para tu cuenta.\n\n
            Por favor, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador para completar el proceso:\n\n
            http://${req.headers.host}/reset/${encodedToken}\n\n
            Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.\n`,
        };

        transport.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send('Error sending email.');
            }
            res.status(200).send(
                'An e-mail has been sent to ' +
                    mail +
                    ' with further instructions.'
            );
        });
    } catch (error) {
        next(error);
    }
}
export async function premium(req, res, next) {
    const { email, rol } = req.body;
    const rolUser = await usuariosService.updateRol(email, rol);
    return res.status(200).json({ message: rolUser });
}

export async function newPassword(req, res, next) {
    //recibe el token del password buscamos el usuario y le agregamos la nueva contraseña.
    try {
        const data = req.body;
        const decodedToken = data.decodedToken;
        const user = await usuariosService.findOneUserTokenMongo(decodedToken);

        if (!user) res.sendStatus(404);
        const result = await usuariosService.newPassword(data, user);

        if (result.error) {
            switch (result.code) {
                case 'PASSWORDS_DO_NOT_MATCH':
                    return res.status(400).json({
                        error: 'las contraseñas tienen que coincidir',
                    });
                case 'PASSWORDS_ARE_SAME':
                    return res.status(400).json({
                        error: 'no puedes cambiar tu contraseña por la actual',
                    });
                default:
                    return res
                        .status(500)
                        .json({ error: 'An unknown error occurred' });
            }
        }
        res.sendStatus(200);
    } catch (error) {}
}
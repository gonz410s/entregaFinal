import { TIPOS_ERROR } from '../utils/EError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    logger.error(`${error.message}`);

    // Evita enviar múltiples respuestas
    if (res.headersSent) {
        return next(error); 
    }

    res.setHeader('Content-Type', 'application/json');

    if (error.code === TIPOS_ERROR.AUTENTICATION || error.code === TIPOS_ERROR.AUTORIZACION) {
        return res.status(401).json({ error: `Credenciales incorrectas` });
    }

    if (error.code === TIPOS_ERROR.ARGUMENTOS_INVALIDOS || error.code === TIPOS_ERROR.PRODUCTO_EXISTENTE) {
        return res.status(400).json({ error: `${error.message}` });
    }

    if (error.code === TIPOS_ERROR.NOT_FOUND) {
        return res.status(404).json({ error: `${error.message}` });
    }

    return res.status(500).json({ error: `Error - contacte al administrador` });
};

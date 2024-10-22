
import { Router } from 'express';
import { sesionesRouter } from './sesiones.router.js';
import { usuariosRouter } from './usuarios.router.js';
import { productosRouter } from './productos.router.js';

export const webRouter = Router();

webRouter.use(sesionesRouter);
webRouter.use(usuariosRouter);
webRouter.use(productosRouter);
webRouter.get('/', (req, res) => {
    return res.redirect('/login');
});




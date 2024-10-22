
import { Router } from 'express';
import { vistaProducto } from '../../controllers/router/productos.controllers.js';
import {  autorizacionUsuario } from '../../middlewares/autorizaciones.js';

export const productosRouter = Router();

productosRouter.get('/productos',autorizacionUsuario, vistaProducto);


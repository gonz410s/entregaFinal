
import { Router } from 'express';
import {deleteProduct, compraCarrito , addProductCart, postCartsController } from '../../controllers/carritos.controllers.js';

export const carritoRouter = Router();

carritoRouter.post('/:userId',  postCartsController )

carritoRouter.post('/addProduct/:cid', addProductCart);


carritoRouter.post('/purchase/:cid', compraCarrito)


carritoRouter.delete('/:cid/:pid',deleteProduct)
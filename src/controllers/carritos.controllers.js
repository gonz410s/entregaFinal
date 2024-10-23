import { carritoService } from '../services/carrito.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { logger } from '../utils/logger.js';

export async function postCartsController(req, res, next) {
    try {
        const userId = req.user.id; // Obtener ID del usuario autenticado
        let carrito = await carritoService.findOne({ usuario: userId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ carrito });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({ error: error.message });
        } else {
            res.status(TIPOS_ERROR.INTENRAL_SERVER_ERROR).json({
                error: 'Error interno del servidor',
            });
        }
        next(error);
    }
}

export async function addProductCart(req, res, next) {
    const { cid: carritoId } = req.params;
    const producto = req.body;

    try {
        if (!producto || Object.keys(producto).length === 0) {
            return next(
                CustomError.createError(
                    'Error en el envío del producto',
                    null,
                    'No se recibió el producto',
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                )
            );
        }

        const carrito = await carritoService.findByIdCart(carritoId);

        if (!carrito) {
            return next(
                CustomError.createError(
                    'No se encontró el carrito',
                    `No se encontró el carrito con el ID: ${carritoId}`,
                    'No se encontró el carrito',
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        await carritoService.addProductCart(carrito, producto);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ carrito });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

export async function compraCarrito(req, res, next) {
    const carritoId = req.params.cid;
    const productos = req.body;

    try {
        const amount = await carritoService.getQuantityStock(carritoId, productos);

        res.status(200).json({
            status: 'success',
            payload: {
                carritoId: carritoId,
                amount: amount,
                mensaje: 'Compra realizada con éxito',
            },
        });
        logger.info(`producto comprado : ${amount}`);
    } catch (error) {
        logger.error(`Error durante la compra del carrito: ${error.message}`);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    const carritoId = req.params.cid;
    const idProduct = req.params.pid;
    try {
        const carrito = await carritoService.findByIdCart(carritoId);
        if (!carrito) {
            return next(
                CustomError.createError(
                    `el carrito con Id:${carritoId} no existe `,
                    null,
                    `el carrito con Id:${carritoId} no existe `,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }
        const producto = await carritoService.deleteProduct(carrito, idProduct);
        if (typeof producto === 'undefined') {
            return next(
                CustomError.createError(
                    `el producto con Id:${idProduct} no existe `,
                    null,
                    `el producto con Id:${idProduct} no existe `,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        res.send(carrito);
    } catch (error) {
        next(error);
    }
}

import { getDaoCarrito } from '../dao/carritos/carritos.dao.js';
import { toPOJO } from '../dao/utils.js';
import { CustomError } from '../utils/CustomErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { productoService } from './productos.service.js';

const carritoDao = getDaoCarrito();

class CarritoService {
    async create(criterio) {
        return await carritoDao.create(criterio);
    }

    async findOne(userId) {
        try {
            if (!userId || typeof userId !== 'string') {
                throw CustomError.createError(
                    'InvalidUserId',
                    null,
                    'El ID de usuario no es válido o no se recibió correctamente.',
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                );
            }

            let carrito = await carritoDao.findCart(userId);
            if (!carrito) {
                carrito = await carritoDao.create({
                    usuario: userId,
                    products: [],
                });
            }
            return carrito;
        } catch (error) {
            console.error('Error in findOne:', error);
            throw CustomError.createError(
                'ErrorInterno',
                error,
                'Ocurrió un error interno del servidor al buscar o crear el carrito.',
                TIPOS_ERROR.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findByIdCart(id) {
        return await carritoDao.findByIdCart(id);
    }

    async addProductCart(carrito, productoAdd) {
        const { producto } = productoAdd;
        if (!producto || !producto['_id'] || !producto['title'] || !producto['price'] || !producto['description']) {
            throw CustomError.createError(
                'Invalid Product Data',
                null,
                'The product data is incomplete or invalid',
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const productoExistente = carrito.products.find(
            (itemProducto) => itemProducto.idProduct == producto['_id']
        );

        if (productoExistente) {
            productoExistente.quantity += 1;
        } else {
            const aux = {
                idProduct: producto['_id'],
                title: producto['title'],
                price: producto['price'],
                description: producto['description'],
                quantity: 1,
            };
            carrito.products.push(aux);
        }

        await carrito.save();
    }

    async getQuantityStock(idCarrito, productosCarritos) {
        return await productoService.compareStock(idCarrito, productosCarritos);
    }

    async deleteProduct(carrito, idProduct) {
        const productIndex = carrito.products.findIndex(
            (product) => product.idProduct === idProduct
        );
        if (productIndex == -1) {
            return undefined;
        }
        carrito.products.splice(productIndex, 1);
        await carrito.save();
        return toPOJO(carrito);
    }

    async buscarIndiceDelProducto(Idcarrito, productoId) {
        const carrito = await this.findByIdCart(Idcarrito);
        const productoIndex = carrito.products.findIndex(
            (item) => item.idProduct === productoId
        );

        if (productoIndex === -1) {
            return 'producto no encontrado';
        }
        carrito.products.splice(productoIndex, 1);
        await carrito.save();
    }
}

export const carritoService = new CarritoService();

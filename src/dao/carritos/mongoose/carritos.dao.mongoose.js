import carritoModel from './carritos.models.mongoose.js';
import { toPOJO } from '../../utils.js';
import { CustomError } from '../../../utils/CustomErrors.js'; // Agregado para manejar los errores personalizados
import { TIPOS_ERROR } from '../../../utils/EError.js'; // Aseguramos que TIPOS_ERROR esté disponible

export class carritoDaoMongoose {
    constructor(cartsModel = carritoModel) { // Definir cartsModel con un valor predeterminado
        this.cartsModel = cartsModel;
    }

    async create(data) {
        const carrito = await this.cartsModel.create(data);
        return toPOJO(carrito);
    }

    async findCart(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new Error('El ID de usuario no es válido o no está definido.');
        }
        const carrito = await this.cartsModel.findOne({ usuario: userId }); // Corregido para usar this.cartsModel
        return carrito;
    }

    async findByIdCart(id) {
        const carrito = await this.cartsModel.findById(id);
        return carrito;
    }

    async findOne(usuarioId) {
        try {
            if (!usuarioId || typeof usuarioId !== 'string') {
                throw CustomError.createError(
                    'InvalidUserId',
                    null,
                    'El ID de usuario no es válido o no se recibió correctamente.',
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                );
            }

            let carrito = await this.findCart(usuarioId); // Cambiado carritoDao a this para evitar errores

            if (!carrito) {
                carrito = await this.create({
                    usuario: usuarioId,
                    products: [],
                });
            }
            return carrito;
        } catch (error) {
            console.error('Error in findOne:', error);

            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.createError(
                    'ErrorInterno',
                    error,
                    'Ocurrió un error interno del servidor al buscar o crear el carrito.',
                    TIPOS_ERROR.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

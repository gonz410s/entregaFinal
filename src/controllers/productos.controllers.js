
import { productoService } from '../services/productos.service.js';
import { CustomError } from '../utils/CustomErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { generateProducts } from '../utils/mock.js';

export async function getcontroller(req, res, next) {
    try {
        const productos = await productoService.readProduct();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
}

export async function postcontroller(req, res, next) {
    try {
        const newProduct = req.body;
        const productIdExists = await productoService.productById(
            newProduct['_id']
        );
       

        if (productIdExists) {
            return next(
                CustomError.createError(
                    `el producto ya existe `,
                    null,
                    `el producto ya existe `,
                    TIPOS_ERROR.PRODUCTO_EXISTENTE
                )
            );
        }

        const producto = await productoService.createProduct(newProduct);
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(producto);
    } catch (error) {
        console.log(error.name)
        if(error.name === 'ValidationError'){
            return next(
                CustomError.createError(
                    'faltan completar datos',
                    error,
                    'faltan completar datos',
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                ))
        }
        if (error.name === 'StrictModeError') {
            // Manejo de errores de validación de Mongoose
            return next(
                CustomError.createError(
                    'Datos de producto inválidos',
                    error,
                    'Datos de producto inválidos',
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                )
            );
        } else {
            next(error); // Pasar cualquier otro error al siguiente middleware de manejo de errores
        }
    }
}

export async function deletecontroller(req, res, next) {
    try {
        const id = req.params.pid;
        const productoDelete = await productoService.deleteOne({ _id: id });
        if (productoDelete.deletedCount > 0) {
            return res.send(`Se elimino el producto con Id: ${id}  `);
        } else {
            return res
                .status(404)
                .send(`no se encontro ningun producto con Id: ${id}`);
        }
    } catch (error) {
        next(error)
    }
}

export async function putcontroller(req, res, next) {
    const idProduct = req.params.pid;
    const nuevosDatos = req.body;
    delete nuevosDatos._id;
    if ('code' in nuevosDatos) {
        return res
            .status(400)
            .send('No se permite modificar los campos id y code.');
    }
    try {
        const productoActualizado = await productoService.updateOne(
            { _id: idProduct },
            nuevosDatos
        );
        if (productoActualizado.matchedCount != 1) {
            return res.status(400).send('id de producto no existe');
        }
        return res.send('el producto se actualizo');
    } catch (error) {}
}


export async function generatemock (req,res,next){ 
    const products = generateProducts();
    res.send(products);
}
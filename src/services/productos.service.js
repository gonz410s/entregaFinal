
import { getDaoProductos } from '../dao/productos/productos.dao.js';
import { carritoService } from './carrito.service.js';

 const productosDao = getDaoProductos();

class ProductoService {
    async readProduct() {
        return await productosDao.findproducts();
    }

    async productById(id) {
        return await productosDao.getProductById(id);
    }

    async createProduct(newProduct) {
        return await productosDao.createProduct(newProduct);
    }

    async deleteOne(id) {
        return await productosDao.deleteOne(id);
    }

    async updateOne(id,datos) {
       
        return await productosDao.updateOne(id, datos);
    }
    async compareStock(idCarrito,productosCarritos){
        let amount = 0;
     
        for (const product of productosCarritos.products) {
            const quantityBuyProduct = product.quantity;
            const id = product.idProduct;
            const productoStock = await productosDao.getProductById(id);

            if (productoStock.stock >= quantityBuyProduct) {
                //compramos que esten los productos en el stock y los restamos de productos
                const restaStock = productoStock.stock - quantityBuyProduct;
                const idProduct = { _id: id };
                const nuevoStock = { stock: restaStock };
                await productosDao.updateOne(idProduct, nuevoStock);
              
                amount += product.price * quantityBuyProduct;
                //eliminar producto del carrito
                await carritoService.buscarIndiceDelProducto(idCarrito, id);
            }
        }
      
        return amount;
    } 
}

export const productoService = new ProductoService();
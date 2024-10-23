
import { fakerES as faker } from '@faker-js/faker';


export const generateProduct = () => {
    return {
        _id: Math.random().toString(36).substring(2), 
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url(), 
        code: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 0, max: 100 }), 
        category: faker.commerce.department(),
        status: faker.helpers.arrayElement(['true']),
    };
};

// Función para generar productos
export const generateProducts = (numProducts = 100) => {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
        products.push(generateProduct());
    }
    return products;
};


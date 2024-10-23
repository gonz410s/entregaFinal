// models/carrito.model.js
import { Schema, model } from 'mongoose';

export const cartsSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => Math.random().toString(36).substring(2),
        },
        usuario: {
            type: String,
            required: true,
        },
        products: [
            {
                idProduct: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        strict: 'throw',
        versionKey: false,
        _id: false,
    }
);

const carritoModel = model('carritos', cartsSchema);
export default carritoModel;

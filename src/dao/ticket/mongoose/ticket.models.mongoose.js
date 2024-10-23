
import { Schema } from 'mongoose';

export const ticketSchema = new Schema(
    {
    code: {
        type: String,
        unique: true, 
        required: true,
        default: () => Math.random().toString(36).substring(2, 10), // Genera un código aleatorio
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
   
    
},
 {
        strict: 'throw',
        versionKey: false,
        methods: {},
    });
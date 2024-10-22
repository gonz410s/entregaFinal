
import { Schema } from 'mongoose';
import { randomUUID } from 'node:crypto';

export const usuariosSchema = new Schema(
    {
        _id: { type: String, default: randomUUID },
        email: { type: String, unique: true, required: true },
        password: { type: String, default: '(no aplica)' },
        nombre: { type: String, required: true },
        apellido: { type: String, default: '(sin especificar)' },
        rol: { type: String, default: 'usuario' },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },   
    },
    {
        strict: 'throw',
        versionKey: false,
        statics: {},
    }
);
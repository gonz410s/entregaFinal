
export const PORT = 8080;
export const MONGODB_CNX_STR =
    'mongodb+srv://gonz410:lalala@clustergonza.qd3uj.mongodb.net/proyectoFinalGonz410?retryWrites=true&w=majority';
export const SESSION_SECRET = 'SecretCoder';

//mail send
import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'joaquin.ariel.lopez.98@gmail.com',
        pass: 'nmst xewa jbdt iegw',
    },
});

//swagger

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'documentacion',
            description: 'API pensada para clase de Swagger',
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

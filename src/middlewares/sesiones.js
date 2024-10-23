
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { MONGODB_CNX_STR, JWT_SECRET } from '../config.js';

const store = connectMongo.create({
    mongoUrl: MONGODB_CNX_STR,
    ttl: 60 * 60 * 24 * 15,
});

export const sesiones = session({
    store,
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
});

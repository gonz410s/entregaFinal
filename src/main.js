
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress  from 'swagger-ui-express';
import { MONGODB_CNX_STR, PORT, swaggerOptions } from './config.js';
import { apiRouter } from './routers/api/apirest.router.js';
import { webRouter } from './routers/web/web.router.js';
import { sesiones } from './middlewares/sesiones.js';
import {
    passportInitialize,
    passportSession,
} from './middlewares/autenticaciones.js';
import { errorHandler } from './middlewares/errorhandler.js';
import { logger, middLogger } from './utils/logger.js';

logger;

// Conexión a la base de datos
await mongoose.connect(MONGODB_CNX_STR);
logger.info(`Conectado a la base de datos en: "${MONGODB_CNX_STR}"`);

export const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Middleware y configuración de sesiones
app.use(sesiones);
app.use(passportInitialize, passportSession);

app.use(middLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/static', express.static('./static'));
app.use('/', webRouter);
app.use('/api', apiRouter);

// Configuración de socket.io
io.on('connection', (socket) => {
    logger.info('Nuevo usuario conectado: ' + socket.id);

    socket.on('mensaje', (data) => {
        io.emit('mensaje', data);
    });

    socket.on('disconnect', () => {
        logger.info('Usuario desconectado: ' + socket.id);
    });
});


app.use(express.static(path.join(path.resolve(), 'static')));

//Manejador de errores

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

app.use(errorHandler);
// Iniciar el servidor
server.listen(PORT, () => {

    logger.info(`Servidor escuchando peticiones en puerto: ${PORT}`);
});

app.get('/loggerTest', (req, res) => {
    req.logger.debug('debug log ');
    req.logger.http('http log');
    req.logger.info('info log');
    req.logger.warning('warning log');
    req.logger.error('error log');
    req.logger.fatal('fatal log');

    res.send('prueba de logs.');
});




import { Router } from 'express';

import { soloLogueadosApi } from '../../middlewares/autorizaciones.js';
import { hashear } from '../../utils/criptografia.js';
import {premium, newPassword, crearUsuario, editUser, getUserLogeado } from '../../controllers/usuarios.controllers.js';

export const usuariosRouter = Router();

usuariosRouter.post('/', crearUsuario);

usuariosRouter.post('/premium',premium)


usuariosRouter.get('/current', soloLogueadosApi, getUserLogeado)

usuariosRouter.post('/recuperarPassword', editUser);

usuariosRouter.post('/newPassword',newPassword)


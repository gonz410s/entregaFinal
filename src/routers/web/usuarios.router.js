
import { Router } from 'express'
import { editUser,vistaReset,vistaRegistro, vistaResetPassword, vistasAdmin, vistasProfile } from '../../controllers/router/usuarios.controllers.js'
import { autorizacionAdmin, autorizacionUsuario } from '../../middlewares/autorizaciones.js'

export const usuariosRouter = Router()

// registro

usuariosRouter.get('/register', vistaRegistro)

// modificar usuario

usuariosRouter.get('/resetpassword', vistaResetPassword)

    
usuariosRouter.get('/reset/:token',vistaReset)



usuariosRouter.get('/edit', editUser)

// perfil

usuariosRouter.get('/profile',autorizacionUsuario,vistasProfile )


usuariosRouter.get('/admin',autorizacionAdmin, vistasAdmin)



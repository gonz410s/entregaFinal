
import { toPOJO } from '../../utils.js';

export class usuariosDaoMongoose {
    constructor(usuariosModel) {
        this.usuariosModel = usuariosModel;
    }
    async createUsuario(newUser) {
        const usuario = await this.usuariosModel.create(newUser);
        return toPOJO(usuario);
    }

    async findOneUser(datos) {
        const usuario = await this.usuariosModel.find(datos).lean();

        return toPOJO(usuario);
    }
    async findOneUserMongo(datos) {
        const usuario = await this.usuariosModel.findOne(datos);

        return usuario;
    }

    async login(email) {
        return this.usuariosModel.model('usuarios').findOne({ email }).lean();
    }
    async findOneAndUpdate(datos) {
        return this.usuariosModel.findOneAndUpdate(datos);
    }
    async findByIdAndUpdate(datos, newPassword) {
        const update = await this.usuariosModel.findByIdAndUpdate(datos, {
            password: newPassword,
        });
        return update;
    }

    async userPremium(email) {
        const update = await this.usuariosModel.findOneAndUpdate(
            { email: email },
            { rol: 'premium' },
            { new: true }
        );
        return  'ahora eres usuario PREMIUM' ;
    }

    async userUsuario(email) {
        const update = await this.usuariosModel.findOneAndUpdate(
            { email: email },
            { rol: 'usuario' },
            { new: true }
        );

        return 'ya no eres usuario PREMIUM' ;
    }
}
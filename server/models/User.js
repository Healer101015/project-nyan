const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    foto: { type: String, default: 'default_profile_pic_url' }, // URL de uma foto padrão
    isAdmin: { type: Boolean, default: false } // Simplificado - verifique pelo email no .env
}, { timestamps: true });

// Adicionar hook pre-save para bcrypt (como no seu código original)

module.exports = mongoose.model('User', UserSchema);
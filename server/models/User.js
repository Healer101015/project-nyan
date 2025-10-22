// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    login: { // NOVO
        type: String,
        unique: true,
        required: true,
    },
    nome: { // NOVO
        type: String,
        required: true,
    },
    foto: { // NOVO
        type: String, // URL para a imagem de perfil
        default: 'default_avatar_url.png'
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model("User", UserSchema);
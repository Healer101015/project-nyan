const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    coverImage: { type: String, required: true }, // URL da imagem de capa
    description: { type: String, required: true },
    author: { type: String },
    status: { type: String, enum: ['Em Lançamento', 'Completo', 'Hiato'], default: 'Em Lançamento' },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // Array de URLs das páginas, ordenadas
    pages: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Manga', MangaSchema);
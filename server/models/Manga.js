// server/models/Manga.js
const mongoose = require("mongoose");

const MangaSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String, // Capa
    category: String, // Gênero (Ação, Comédia, etc.)
    // Adicionar campos específicos de mangá
    author: String,
    status: String, // Em andamento, Concluído
    volumes: Number,
    // ... outros campos que você queira
});

module.exports = mongoose.model("Manga", MangaSchema);
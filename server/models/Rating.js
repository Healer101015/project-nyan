// server/models/Rating.js (Notas)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 10 }, // Nota de 1 a 10
    malScore: { type: Number, min: 1, max: 10 }, // Nota do MAL (opcional)
}, { timestamps: true });

// Garante que um usuário só pode dar uma nota por mangá
RatingSchema.index({ manga: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
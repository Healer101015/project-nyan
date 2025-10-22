// server/models/Favorite.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Garante que um usuário só pode favoritar um mangá uma vez
FavoriteSchema.index({ manga: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
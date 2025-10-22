// src/components/MangaCard.jsx
import React from "react";
import { Link } from "react-router-dom";

// isExternal é opcional, para o caso de você querer linkar para o MAL
export default function MangaCard({ id, imageUrl, name, isExternal = false }) {
    const content = (
        <div className="relative aspect-[2/3] w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-purple-500/30">
            <img
                src={imageUrl || "https://via.placeholder.com/400x600?text=Capa"}
                alt={name || "Capa do Mangá"}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
    );

    if (isExternal) {
        // Linka para o MyAnimeList se for da seção de recomendações
        return (
            <a
                href={`https://myanimelist.net/manga/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
            >
                {content}
            </a>
        );
    }

    // Linka para a página de detalhes interna do seu site
    return (
        <Link to={`/manga/${id}`} title={name}>
            {content}
        </Link>
    );
}
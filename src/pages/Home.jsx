// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MangaCard from "../components/MangaCard"; // Novo componente

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Busca do seu catálogo
        const mangasRes = await axios.get("http://localhost:4000/api/mangas");
        setMangas(mangasRes.data);

        // Busca das recomendações do MAL (do seu backend)
        const malRes = await axios.get("http://localhost:4000/api/mal/top-weekly");
        setRecommendations(malRes.data);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">

        {/* Seção de Recomendações do MAL */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400 uppercase tracking-wider">
            Top 10 da Semana (MyAnimeList)
          </h2>
          {loading ? (
            <p>Carregando recomendações...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3">
              {recommendations.map((malManga) => (
                // O MangaCard espera um 'id' e 'imageUrl'.
                // A API do MAL fornece 'id' e 'main_picture.medium'
                <MangaCard
                  key={malManga.id}
                  id={malManga.id} // Este ID é do MAL, não do seu DB. Apenas para exemplo.
                  imageUrl={malManga.main_picture.medium}
                  isExternal={true} // Prop para indicar que é um link externo (opcional)
                />
              ))}
            </div>
          )}
        </section>

        {/* Seção do Catálogo Principal */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 uppercase tracking-wider">
            Seu Catálogo
          </h2>
          {loading ? (
            <p>Carregando catálogo...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {mangas.map((manga) => (
                <MangaCard
                  key={manga._id}
                  id={manga._id}
                  imageUrl={manga.imageUrl}
                  name={manga.name}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
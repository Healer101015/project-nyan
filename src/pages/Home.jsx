import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importando o MangaCard do caminho que você forneceu
import MangaCard from '../components/MangaCard';

const Home = () => {
  // Estado para o catálogo interno
  const [mangas, setMangas] = useState([]);
  // Estado para as recomendações do MAL
  const [malWeekly, setMalWeekly] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função assíncrona para buscar todos os dados
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Busca os dados das duas APIs em paralelo
        const [mangaRes, malRes] = await Promise.all([
          axios.get('http://localhost:5001/api/mangas'), // Seu catálogo
          axios.get('http://localhost:5001/api/mal/weekly') // API do MAL (via seu backend)
        ]);

        // Define o estado do catálogo interno
        setMangas(mangaRes.data);

        // A API do MAL (v2) retorna os dados em um formato { data: [ { node: {...} }, ... ] }
        // O backend (server.js) já deve ter extraído o 'data', então esperamos um array de { node: {...} }
        // Mapeamos para extrair apenas os objetos 'node' que contêm os detalhes do mangá
        setMalWeekly(malRes.data.map(item => item.node));

      } catch (err) {
        console.error("Erro ao buscar dados da home:", err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // O array vazio [] garante que isso rode apenas uma vez (componentDidMount)

  // Estado de carregamento
  if (loading) {
    return <div className="text-center text-xl mt-10">Carregando...</div>;
  }

  // Estado de erro
  if (error) {
    return <div className="text-center text-xl mt-10 text-red-500">{error}</div>;
  }

  // Renderização principal
  return (
    <div className="space-y-12">

      {/* Seção de Recomendações MyAnimeList */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 border-b-2 border-cyan-500 pb-2">
          Top da Semana (MyAnimeList)
        </h2>
        {malWeekly.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {malWeekly.map(manga => (
              <MangaCard
                key={manga.id} // ID único do MAL
                id={manga.id}  // ID do MAL para o link externo
                imageUrl={manga.main_picture?.large || manga.main_picture?.medium}
                name={manga.title}
                isExternal={true} // <-- Diz ao MangaCard para usar <a>
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Não foi possível carregar as recomendações.</p>
        )}
      </section>

      {/* Seção do Catálogo Principal (Seu Site) */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-100 border-b-2 border-gray-700 pb-2">
          Nosso Catálogo
        </h2>
        {mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {mangas.map(manga => (
              <MangaCard
                key={manga._id} // ID único do MongoDB
                id={manga._id}  // ID do MongoDB para o link interno
                imageUrl={manga.coverImage}
                name={manga.title}
                isExternal={false} // <-- Diz ao MangaCard para usar <Link>
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Nenhum mangá encontrado no nosso catálogo ainda. Visite a página de Admin para adicionar.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
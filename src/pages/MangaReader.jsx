import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Para obter o token

const MangaReader = () => {
    const { id: mangaId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [manga, setManga] = useState(null);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Index da página atual (começa em 0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPages = async () => {
            if (!token) return; // Espera o token estar disponível

            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5001/api/mangas/${mangaId}/read`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setManga(res.data);
                setPages(res.data.pages || []); // Garante que pages é um array
                setCurrentPage(0); // Começa da primeira página
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar o capítulo. Talvez você não tenha permissão ou o mangá não tenha páginas.');
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [mangaId, token]);

    const goToNextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePageChange = (e) => {
        const pageIndex = parseInt(e.target.value, 10);
        setCurrentPage(pageIndex);
    };

    if (loading) return <div className="text-center text-xl">Carregando leitor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;
    if (pages.length === 0) return <div className="text-center text-xl">Este mangá ainda não possui páginas.</div>;

    return (
        <div className="w-full flex flex-col items-center bg-gray-800 p-4 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{manga?.title} - Página {currentPage + 1} de {pages.length}</h1>

            {/* Navegação Superior */}
            <div className="flex items-center justify-center gap-4 mb-4 w-full max-w-4xl">
                <button
                    onClick={() => navigate(`/manga/${mangaId}`)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Voltar aos Detalhes
                </button>
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                <select
                    value={currentPage}
                    onChange={handlePageChange}
                    className="bg-gray-700 border border-gray-600 rounded px-4 py-2"
                >
                    {pages.map((_, index) => (
                        <option key={index} value={index}>
                            Página {index + 1}
                        </option>
                    ))}
                </select>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === pages.length - 1}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>

            {/* Imagem da Página */}
            <div className="w-full max-w-4xl flex justify-center">
                <img
                    src={pages[currentPage]}
                    alt={`Página ${currentPage + 1}`}
                    className="max-w-full h-auto object-contain"
                />
            </div>

            {/* Navegação Inferior (opcional) */}
            <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-4xl">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === pages.length - 1}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default MangaReader;
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Para login e token
import { FaStar, FaHeart, FaRegHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Ícones

const MangaDetails = () => {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);

    const [manga, setManga] = useState(null);
    const [comments, setComments] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [loading, setLoading] = useState(true);

    // Estado de interação do usuário
    const [isFavorited, setIsFavorited] = useState(false);
    const [userRating, setUserRating] = useState(null); // Nota do usuário (1-10)
    const [malRating, setMalRating] = useState(null); // Nota MAL (1-10)
    const [newComment, setNewComment] = useState("");

    // Hook para buscar dados do mangá, comentários e estado do usuário
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5001/api/mangas/${id}`);
                setManga(res.data.manga);
                setComments(res.data.comments);
                setAvgRating(res.data.avgRating);
                setTotalRatings(res.data.totalRatings);

                // Se o usuário estiver logado, buscar seu estado (favorito, nota)
                if (user && token) {
                    // (Lógica para buscar favoritos e notas do usuário - idealmente viria do /api/profile ou de uma rota específica)
                    // Por simplicidade, vamos assumir que precisamos verificar aqui:
                    // Ex: const favRes = await axios.get(`/api/user/favorites`, config);
                    // Ex: const ratRes = await axios.get(`/api/user/ratings`, config);
                    // setIsFavorited(favRes.data.some(f => f.manga._id === id));
                    // setUserRating(ratRes.data.find(r => r.manga._id === id)?.score);
                }

            } catch (error) {
                console.error("Erro ao buscar detalhes do mangá:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user, token]);

    // --- Handlers de Interação ---

    const handleFavorite = async () => {
        if (!user) return alert('Você precisa estar logado para favoritar.');
        try {
            await axios.post(`http://localhost:5001/api/mangas/${id}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFavorited(!isFavorited); // Toggle local
        } catch (error) {
            console.error("Erro ao favoritar:", error);
        }
    };

    const handleRating = async (score) => {
        if (!user) return alert('Você precisa estar logado para avaliar.');
        setUserRating(score);
        try {
            await axios.post(`http://localhost:5001/api/mangas/${id}/rate`,
                { score, malScore: malRating }, // Envia a nota MAL junto se existir
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Idealmente, o backend retornaria a nova média
            // Por enquanto, apenas atualizamos localmente
        } catch (error) {
            console.error("Erro ao avaliar:", error);
        }
    };

    const handleMalRating = async (e) => {
        const score = e.target.value ? parseInt(e.target.value) : null;
        setMalRating(score);
        // Se o usuário já deu uma nota principal, atualiza a nota MAL no backend
        if (userRating && score) {
            try {
                await axios.post(`http://localhost:5001/api/mangas/${id}/rate`,
                    { score: userRating, malScore: score },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Erro ao atualizar nota MAL:", error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user || !newComment) return;
        try {
            const res = await axios.post(`http://localhost:5001/api/mangas/${id}/comment`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Adiciona o novo comentário (com dados do usuário populados pelo backend)
            setComments([res.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Erro ao comentar:", error);
        }
    };

    const handleVote = async (commentId, voteType) => {
        if (!user) return alert('Você precisa estar logado para votar.');
        try {
            const res = await axios.post(`http://localhost:5001/api/comments/${commentId}/vote`,
                { voteType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Atualiza o comentário específico na lista
            setComments(comments.map(c => c._id === commentId ? res.data : c));
        } catch (error) {
            console.error("Erro ao votar:", error);
        }
    };

    if (loading) return <div className="text-center text-xl">Carregando mangá...</div>;
    if (!manga) return <div className="text-center text-xl">Mangá não encontrado.</div>;

    // Renderiza estrelas de avaliação
    const StarRating = ({ score, onRate }) => (
        <div className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                <FaStar
                    key={star}
                    className={`cursor-pointer ${score >= star ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300`}
                    onClick={() => onRate(star)}
                />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">

            {/* Coluna Esquerda: Capa e Ações (Estilo Letterboxd) */}
            <aside className="w-full lg:w-1/4 flex-shrink-0">
                <img
                    src={manga.coverImage}
                    alt={manga.title}
                    className="w-full rounded-lg shadow-2xl mb-4"
                />

                {/* Ações do Usuário (Logado) */}
                {user && (
                    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                        {/* Favorito */}
                        <div className="flex items-center justify-between">
                            <span className="text-lg">Favoritar:</span>
                            <button onClick={handleFavorite} className="text-3xl text-red-500">
                                {isFavorited ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        </div>

                        {/* Avaliação */}
                        <div>
                            <span className="text-lg mb-2 block">Sua Avaliação:</span>
                            <StarRating score={userRating} onRate={handleRating} />
                        </div>

                        {/* Nota MAL */}
                        <div>
                            <label htmlFor="mal_score" className="text-lg mb-2 block">Nota MyAnimeList:</label>
                            <input
                                type="number"
                                id="mal_score"
                                min="1" max="10"
                                value={malRating || ""}
                                onChange={handleMalRating}
                                placeholder="Nota MAL (1-10)"
                                className="w-full p-2 bg-gray-700 rounded"
                            />
                        </div>
                    </div>
                )}

                {/* Link do Leitor */}
                <Link
                    to={`/manga/${id}/read`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 text-xl"
                >
                    Ler Agora
                </Link>
            </aside>

            {/* Coluna Direita: Informações e Comentários */}
            <main className="w-full lg:w-3/4">
                {/* Título e Info */}
                <h1 className="text-5xl font-bold mb-2">{manga.title}</h1>
                <p className="text-xl text-gray-400 mb-4">Por {manga.author || 'Desconhecido'}</p>

                {/* Avaliação Média */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-yellow-400">{avgRating}</span>
                    <span className="text-gray-400">({totalRatings} avaliações)</span>
                </div>

                {/* Descrição */}
                <div className="prose prose-invert max-w-none bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
                    <p>{manga.description}</p>
                </div>

                {/* Categorias e Status */}
                <div className="flex gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-1">Status</h4>
                        <span className="text-cyan-400">{manga.status}</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-1">Categorias</h4>
                        <div className="flex flex-wrap gap-2">
                            {manga.categories.map(cat => (
                                <span key={cat._id} className="bg-gray-700 px-2 py-1 rounded text-sm">
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seção de Comentários */}
                <section>
                    <h2 className="text-3xl font-bold mb-6">Comentários</h2>

                    {/* Formulário de Novo Comentário */}
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={`Comentar como ${user.nome}...`}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-2"
                                rows="4"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold"
                                disabled={!newComment.trim()}
                            >
                                Postar
                            </button>
                        </form>
                    ) : (
                        <p className="mb-8 text-gray-400">
                            <Link to="/login" className="text-cyan-400 underline">Faça login</Link> para comentar.
                        </p>
                    )}

                    {/* Lista de Comentários */}
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment._id} className="bg-gray-800 p-4 rounded-lg flex gap-4">
                                <img
                                    src={comment.user.foto || 'url_foto_padrao'}
                                    alt={comment.user.nome}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{comment.user.nome}</p>
                                    <p className="text-gray-300 mb-3">{comment.content}</p>

                                    {/* Ações do Comentário (Votos) */}
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <button
                                            onClick={() => handleVote(comment._id, 'upvote')}
                                            className={`flex items-center gap-1 hover:text-green-500 ${comment.upvotes.includes(user?.id) ? 'text-green-500' : ''}`}
                                        >
                                            <FaArrowUp /> {comment.upvotes.length}
                                        </button>
                                        <button
                                            onClick={() => handleVote(comment._id, 'downvote')}
                                            className={`flex items-center gap-1 hover:text-red-500 ${comment.downvotes.includes(user?.id) ? 'text-red-500' : ''}`}
                                        >
                                            <FaArrowDown /> {comment.downvotes.length}
                                        </button>
                                        <span className="text-xs">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400">Seja o primeiro a comentar!</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MangaDetails;
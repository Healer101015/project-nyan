// src/pages/MangaDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
// (instale @heroicons/react)
import { StarIcon, HeartIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export default function MangaDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [manga, setManga] = useState(null);
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Estados para interação
    const [isFavorited, setIsFavorited] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    const API_URL = "http://localhost:4000/api";
    const token = localStorage.getItem("token");
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // Efeito para buscar todos os dados do mangá
    useEffect(() => {
        const fetchMangaData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/mangas/${id}`);
                setManga(res.data.manga);
                setComments(res.data.comments);
                setRatings(res.data.ratings);
                setAverageRating(res.data.averageRating);

                // Checar se o usuário logado já interagiu
                if (user) {
                    // Checa se o usuário deu nota
                    const myRating = res.data.ratings.find(r => r.user === user.id);
                    if (myRating) setUserRating(myRating.score);

                    // (A API de favoritos precisa ser checada. Vamos assumir que você tem uma rota /api/me/favorites)
                    // const favRes = await axios.get(`${API_URL}/me/favorites`, authHeaders);
                    // setIsFavorited(favRes.data.some(fav => fav.manga === id));
                }
            } catch (err) {
                console.error("Erro ao buscar mangá:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMangaData();
    }, [id, user]);

    // --- Funções de Interação ---

    const handleFavorite = async () => {
        if (!user) return alert("Você precisa estar logado para favoritar.");
        try {
            const res = await axios.post(`${API_URL}/mangas/${id}/favorite`, {}, authHeaders);
            setIsFavorited(res.data.favorited);
        } catch (err) { console.error(err); }
    };

    const handleRating = async (score) => {
        if (!user) return alert("Você precisa estar logado para dar uma nota.");
        setUserRating(score); // Otimista
        try {
            await axios.post(`${API_URL}/mangas/${id}/rate`, { score }, authHeaders);
        } catch (err) { console.error(err); }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!user) return alert("Você precisa estar logado para comentar.");
        if (newComment.trim() === "") return;
        try {
            const res = await axios.post(`${API_URL}/mangas/${id}/comment`, { content: newComment }, authHeaders);
            setComments([res.data, ...comments]); // Adiciona novo comentário no topo
            setNewComment("");
        } catch (err) { console.error(err); }
    };

    const handleVote = async (commentId, voteType) => {
        if (!user) return alert("Você precisa estar logado para votar.");
        try {
            const res = await axios.post(`${API_URL}/comments/${commentId}/vote`, { voteType }, authHeaders);
            // Atualiza o comentário específico na lista
            setComments(comments.map(c => c._id === commentId ? res.data : c));
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
                Carregando...
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
                Mangá não encontrado.
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />

            {/* Banner de Fundo (Opcional, mas robusto) */}
            <div className="h-64 md:h-80 relative">
                <img src={manga.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-md" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            </div>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-48 md:-mt-56 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Coluna Esquerda: Capa e Interações */}
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <img
                            src={manga.imageUrl}
                            alt={manga.name}
                            className="w-full aspect-[2/3] rounded-lg shadow-2xl border-4 border-gray-700"
                        />
                        {/* Botões de Ação */}
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg">
                            <div className="flex justify-around items-center mb-4">
                                <span className="text-3xl font-bold">{averageRating}</span>
                                <div className="flex text-gray-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer ${userRating >= star * 2 ? 'text-purple-500' : 'hover:text-purple-400'}`}
                                            onClick={() => handleRating(star * 2)} // Nota vai de 2 a 10
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleFavorite}
                                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors ${isFavorited
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-purple-600'
                                    }`}
                            >
                                <HeartIcon className="h-5 w-5" />
                                {isFavorited ? "Favoritado" : "Favoritar"}
                            </button>
                        </div>
                    </div>

                    {/* Coluna Direita: Informações e Comentários */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        {/* Informações */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                            <h1 className="text-4xl font-bold mb-2">{manga.name}</h1>
                            <p className="text-lg text-gray-400 mb-4">Autor: {manga.author || "Desconhecido"}</p>
                            <p className="text-gray-300 leading-relaxed">{manga.description || "Nenhuma descrição disponível."}</p>
                            <div className="flex gap-4 mt-4">
                                <span className="bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">{manga.category}</span>
                                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">Status: {manga.status}</span>
                                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">Volumes: {manga.volumes}</span>
                            </div>
                        </div>

                        {/* Seção de Comentários */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Comentários</h2>
                            {/* Formulário de Novo Comentário */}
                            {user && (
                                <form onSubmit={handlePostComment} className="mb-6">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={`Comente sobre ${manga.name}...`}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="3"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Postar Comentário
                                    </button>
                                </form>
                            )}

                            {/* Lista de Comentários */}
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-4 p-4 bg-gray-800 rounded-lg shadow">
                                        <img
                                            src={comment.user.foto || "https://via.placeholder.com/48"}
                                            alt={comment.user.nome}
                                            className="h-12 w-12 rounded-full bg-gray-700 object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-purple-400">{comment.user.nome} <span className="text-sm text-gray-400">@{comment.user.login}</span></p>
                                            <p className="text-gray-300 mt-1">{comment.content}</p>
                                            <div className="flex items-center gap-4 mt-2 text-gray-400">
                                                <button onClick={() => handleVote(comment._id, 'up')} className="flex items-center gap-1 hover:text-green-500">
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                    {comment.upvotes.length}
                                                </button>
                                                <button onClick={() => handleVote(comment._id, 'down')} className="flex items-center gap-1 hover:text-red-500">
                                                    <ArrowDownIcon className="h-4 w-4" />
                                                    {comment.downvotes.length}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
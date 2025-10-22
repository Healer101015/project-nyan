import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MangaCard from "../components/MangaCard";

export default function Profile() {
    const { login } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:4000/api/profile/${login}`);
                setProfile(res.data);
            } catch (err) {
                console.error("Erro ao buscar perfil:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [login]);

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
                Carregando Perfil...
            </div>
        );
    }

    if (!profile || !profile.user) {
        return (
            <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
                Perfil não encontrado.
            </div>
        );
    }

    const { user = {}, favorites = [], ratings = [], comments = [] } = profile;

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />

            {/* Cabeçalho do Perfil */}
            <div className="bg-gray-800 p-8 shadow-lg">
                <div className="container mx-auto flex items-center gap-6">
                    <img
                        src={user.foto || "https://via.placeholder.com/128"}
                        alt={user.nome || user.login || "Usuário"}
                        className="h-32 w-32 rounded-full border-4 border-purple-500 object-cover"
                    />
                    <div>
                        <h1 className="text-4xl font-bold">{user.nome || user.login}</h1>
                        <p className="text-xl text-gray-400">@{user.login}</p>
                        {/* Stats */}
                        <div className="flex gap-6 mt-4 text-gray-300">
                            <div>
                                <span className="font-bold text-2xl text-white">{favorites.length}</span> Favoritos
                            </div>
                            <div>
                                <span className="font-bold text-2xl text-white">{ratings.length}</span> Notas
                            </div>
                            <div>
                                <span className="font-bold text-2xl text-white">{comments.length}</span> Comentários
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Perfil (Favoritos, etc.) */}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">

                {/* Seção de Favoritos */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-400 uppercase tracking-wider">
                        Favoritos
                    </h2>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                            {favorites.map((fav) => (
                                <MangaCard
                                    key={fav._id || fav.manga?._id}
                                    id={fav.manga?._id}
                                    imageUrl={fav.manga?.imageUrl}
                                    name={fav.manga?.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">Este usuário ainda não favoritou nenhum mangá.</p>
                    )}
                </section>

                {/* Seção de Notas */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-400 uppercase tracking-wider">
                        Últimas Notas
                    </h2>
                    {ratings.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                            {ratings.map((rating) => (
                                <div key={rating._id || rating.manga?._id} className="relative">
                                    <MangaCard
                                        id={rating.manga?._id}
                                        imageUrl={rating.manga?.imageUrl}
                                        name={rating.manga?.name}
                                    />
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-gray-900">
                                        {rating.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">Este usuário ainda não deu nenhuma nota.</p>
                    )}
                </section>

            </main>
            <Footer />
        </div>
    );
}
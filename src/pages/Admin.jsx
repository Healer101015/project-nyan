// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Admin() {
    // Estado para o formulário de Mangá
    const [titulo, setTitulo] = useState("");
    const [capa, setCapa] = useState("");
    const [descricao, setDescricao] = useState("");
    const [autor, setAutor] = useState("");
    const [status, setStatus] = useState("Em Andamento");
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [paginas, setPaginas] = useState(""); // Para URLs das páginas

    // Estado para o formulário de Categoria
    const [nomeCategoria, setNomeCategoria] = useState("");

    // Estado para carregar as categorias existentes
    const [categorias, setCategorias] = useState([]);

    // Carrega as categorias existentes ao montar o componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/mangas/categories");
                setCategorias(res.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchCategorias();
    }, []);

    // Handler para seleção de múltiplas categorias
    const handleCategoriaChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setCategoriasSelecionadas(value);
    };

    // Handler para submeter um novo mangá
    const handleMangaSubmit = async (e) => {
        e.preventDefault();
        try {
            // Converte a string de URLs de páginas em um array
            const paginasArray = paginas.split("\n").filter((url) => url.trim() !== "");

            const novoManga = {
                titulo,
                capaUrl: capa,
                descricao,
                autor,
                status,
                categorias: categoriasSelecionadas,
                paginas: paginasArray,
            };

            // O token JWT já está sendo enviado automaticamente pelo Axios (configurado no AuthContext)
            const res = await axios.post(
                "http://localhost:5001/api/admin/mangas",
                novoManga
            );
            toast.success(`Mangá "${res.data.titulo}" adicionado com sucesso!`);

            // Limpar campos
            setTitulo("");
            setCapa("");
            setDescricao("");
            setAutor("");
            setStatus("Em Andamento");
            setCategoriasSelecionadas([]);
            setPaginas("");

        } catch (error) {
            console.error("Erro ao adicionar mangá:", error);
            toast.error(
                "Erro ao adicionar mangá: " +
                (error.response?.data?.message || error.message)
            );
        }
    };

    // Handler para submeter uma nova categoria
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5001/api/admin/categories",
                { nome: nomeCategoria }
            );
            toast.success(`Categoria "${res.data.nome}" adicionada!`);

            // Adiciona a nova categoria à lista e limpa o campo
            setCategorias([...categorias, res.data]);
            setNomeCategoria("");

        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
            toast.error(
                "Erro ao adicionar categoria: " +
                (error.response?.data?.message || error.message)
            );
        }
    };


    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <ToastContainer theme="dark" />
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-purple-400 mb-8">
                    Painel de Administração
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulário de Adicionar Mangá */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Mangá</h2>
                        <form onSubmit={handleMangaSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Título</label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">URL da Capa</label>
                                <input
                                    type="text"
                                    value={capa}
                                    onChange={(e) => setCapa(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Autor</label>
                                <input
                                    type="text"
                                    value={autor}
                                    onChange={(e) => setAutor(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                    <option value="Hiato">Hiato</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Categorias (Segure Ctrl/Cmd para selecionar várias)</label>
                                <select
                                    multiple
                                    value={categoriasSelecionadas}
                                    onChange={handleCategoriaChange}
                                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {categorias.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    rows="4"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">URLs das Páginas (uma por linha)</label>
                                <textarea
                                    value={paginas}
                                    onChange={(e) => setPaginas(e.target.value)}
                                    rows="6"
                                    placeholder="https://exemplo.com/pagina1.jpg&#10;https://exemplo.com/pagina2.jpg&#10;..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                            >
                                Adicionar Mangá
                            </button>
                        </form>
                    </div>

                    {/* Formulário de Adicionar Categoria */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
                        <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Categoria</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Nome da Categoria</label>
                                <input
                                    type="text"
                                    value={nomeCategoria}
                                    onChange={(e) => setNomeCategoria(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                            >
                                Adicionar Categoria
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
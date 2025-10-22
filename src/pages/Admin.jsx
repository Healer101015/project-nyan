import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);

    // Estado para nova categoria
    const [newCategoryName, setNewCategoryName] = useState("");

    // Estado para novo mangá
    const [mangaForm, setMangaForm] = useState({
        title: "",
        coverImage: "",
        description: "",
        author: "",
        status: "Em Lançamento",
        categories: [], // Array de IDs de categoria selecionados
        pages: "" // String de URLs separadas por vírgula
    });

    // Headers de autenticação
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // Buscar categorias existentes
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/categories');
                setCategories(res.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchCategories();
    }, []);

    // Handler para adicionar categoria
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                'http://localhost:5001/api/admin/categories',
                { name: newCategoryName },
                authHeaders
            );
            setCategories([...categories, res.data]);
            setNewCategoryName("");
            alert('Categoria adicionada!');
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
            alert('Erro ao adicionar categoria.');
        }
    };

    // Handler para mudança no formulário do mangá
    const handleMangaChange = (e) => {
        const { name, value } = e.target;
        setMangaForm(prev => ({ ...prev, [name]: value }));
    };

    // Handler para selecionar categorias (checkboxes)
    const handleCategorySelect = (catId) => {
        setMangaForm(prev => {
            const currentCategories = prev.categories;
            if (currentCategories.includes(catId)) {
                return { ...prev, categories: currentCategories.filter(id => id !== catId) };
            } else {
                return { ...prev, categories: [...currentCategories, catId] };
            }
        });
    };

    // Handler para adicionar mangá
    const handleMangaSubmit = async (e) => {
        e.preventDefault();

        // Converte a string de páginas (separadas por vírgula/quebra de linha) em um array
        const pagesArray = mangaForm.pages
            .split(/[\n,]+/) // Divide por vírgula ou nova linha
            .map(url => url.trim()) // Remove espaços em branco
            .filter(url => url.length > 0); // Remove entradas vazias

        if (pagesArray.length === 0) {
            alert('Adicione pelo menos uma URL de página.');
            return;
        }

        try {
            const mangaData = {
                ...mangaForm,
                pages: pagesArray // Envia o array de páginas
            };

            await axios.post(
                'http://localhost:5001/api/admin/mangas',
                mangaData,
                authHeaders
            );

            alert('Mangá adicionado com sucesso!');
            // Limpa o formulário
            setMangaForm({
                title: "", coverImage: "", description: "", author: "",
                status: "Em Lançamento", categories: [], pages: ""
            });
        } catch (error) {
            console.error("Erro ao adicionar mangá:", error.response?.data || error.message);
            alert('Erro ao adicionar mangá.');
        }
    };

    // Estilos de Input (Tailwind)
    const inputStyle = "w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4";
    const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Seção de Adicionar Mangá */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Adicionar Novo Mangá</h2>
                <form onSubmit={handleMangaSubmit}>
                    <label className={labelStyle} htmlFor="title">Título</label>
                    <input type="text" name="title" value={mangaForm.title} onChange={handleMangaChange} className={inputStyle} required />

                    <label className={labelStyle} htmlFor="coverImage">URL da Imagem de Capa</label>
                    <input type="text" name="coverImage" value={mangaForm.coverImage} onChange={handleMangaChange} className={inputStyle} required />

                    <label className={labelStyle} htmlFor="author">Autor</label>
                    <input type="text" name="author" value={mangaForm.author} onChange={handleMangaChange} className={inputStyle} />

                    <label className={labelStyle} htmlFor="description">Descrição</label>
                    <textarea name="description" value={mangaForm.description} onChange={handleMangaChange} className={inputStyle} rows="4" required />

                    <label className={labelStyle} htmlFor="status">Status</label>
                    <select name="status" value={mangaForm.status} onChange={handleMangaChange} className={inputStyle}>
                        <option value="Em Lançamento">Em Lançamento</option>
                        <option value="Completo">Completo</option>
                        <option value="Hiato">Hiato</option>
                    </select>

                    <label className={labelStyle}>Categorias</label>
                    <div className="max-h-32 overflow-y-auto bg-gray-700 p-2 rounded mb-4 border border-gray-600">
                        {categories.map(cat => (
                            <div key={cat._id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={cat._id}
                                    checked={mangaForm.categories.includes(cat._id)}
                                    onChange={() => handleCategorySelect(cat._id)}
                                />
                                <label htmlFor={cat._id}>{cat.name}</label>
                            </div>
                        ))}
                    </div>

                    <label className={labelStyle} htmlFor="pages">
                        Páginas (URLs)
                        <span className="text-xs text-gray-400"> (Separe cada URL por vírgula ou nova linha)</span>
                    </label>
                    <textarea
                        name="pages"
                        value={mangaForm.pages}
                        onChange={handleMangaChange}
                        className={inputStyle}
                        rows="6"
                        placeholder="https://exemplo.com/pagina1.jpg,&#10;https://exemplo.com/pagina2.jpg"
                        required
                    />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                        Adicionar Mangá
                    </button>
                </form>
            </section>

            {/* Seção de Adicionar Categoria */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
                <h2 className="text-2xl font-bold mb-6">Adicionar Nova Categoria</h2>
                <form onSubmit={handleCategorySubmit}>
                    <label className={labelStyle} htmlFor="newCategoryName">Nome da Categoria</label>
                    <input
                        type="text"
                        name="newCategoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className={inputStyle}
                        required
                    />
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">
                        Adicionar Categoria
                    </button>
                </form>

                <h3 className="text-xl font-bold mt-8 mb-4">Categorias Existentes</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <span key={cat._id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                            {cat.name}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Admin;
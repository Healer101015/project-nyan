import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Admin() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        stock: "",
        category: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:4000/api/admin/products",
                {
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    imageUrl: form.imageUrl,
                    stock: Number(form.stock),
                    category: form.category,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Produto criado com sucesso!");
            setForm({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                stock: "",
                category: "",
            });
        } catch (err) {
            setMessage("Erro ao criar produto.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brand-black text-brand-white">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Painel Admin</h1>

                <form onSubmit={handleSubmit} className="max-w-lg bg-gray-800 p-6 rounded shadow">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Nome do Produto *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Descrição</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Preço (R$) *</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">URL da Imagem</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Estoque</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Categoria *</label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded bg-gray-700 border-gray-600"
                            placeholder="Ex: camisetas, moletons, acessorios"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Criar Produto
                    </button>
                    {message && <p className="mt-4">{message}</p>}
                </form>
            </main>
            <Footer />
        </div>
    );
}
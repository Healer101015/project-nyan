const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/gatoa");

const products = [
    {
        name: "Camiseta Preta Básica",
        description: "100% algodão, perfeita para o dia a dia.",
        price: 39.90,
        imageUrl: "https://via.placeholder.com/200x250.png?text=Camiseta+Preta",
        stock: 50,
        category: "camisetas",
    },
    {
        name: "Camiseta Branca Estampada",
        description: "Estampa exclusiva Gatoa.",
        price: 45.90,
        imageUrl: "https://via.placeholder.com/200x250.png?text=Camiseta+Branca",
        stock: 40,
        category: "camisetas",
    },
    {
        name: "Camiseta Cinza Mescla",
        description: "Conforto e estilo em uma só peça.",
        price: 39.90,
        imageUrl: "https://via.placeholder.com/200x250.png?text=Camiseta+Cinza",
        stock: 60,
        category: "camisetas",
    },
];

async function seed() {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Produtos inseridos");
    mongoose.disconnect();
}

seed();
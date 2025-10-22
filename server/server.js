require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

// Inicializa o app
const app = express();
app.use(cors());
app.use(express.json());

// --- LOG DE AMBIENTE ---
console.log("🔍 Verificando variáveis de ambiente...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ OK" : "❌ Faltando");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ OK" : "❌ Faltando");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "⚠️ Não definido");

// --- Conexão com o MongoDB ---
if (!process.env.MONGO_URI) {
    console.error("❌ ERRO: MONGO_URI não está definido no .env!");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB (Project Nyan) conectado com sucesso!'))
    .catch(err => {
        console.error('❌ Erro ao conectar no MongoDB:', err.message);
        process.exit(1);
    });

// --- Importar Modelos ---
const User = require('./models/User');
const Manga = require('./models/Manga');
const Category = require('./models/Category');
const Rating = require('./models/Rating');
const Comment = require('./models/Comment');
const Favorite = require('./models/Favorite');

// --- Middlewares ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token é necessário.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).send('Token inválido.');
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.email === process.env.ADMIN_EMAIL) next();
        else res.status(403).send('Acesso negado. Requer privilégios de administrador.');
    } catch {
        res.status(500).send('Erro ao verificar administrador.');
    }
};

// --- Rotas de Autenticação ---
app.post('/api/register', async (req, res) => {
    try {
        const { nome, email, login, password } = req.body;
        if (!nome || !email || !login || !password)
            return res.status(400).send('Campos obrigatórios faltando.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdminUser = email === process.env.ADMIN_EMAIL;

        const user = new User({
            nome,
            email,
            login,
            password: hashedPassword,
            isAdmin: isAdminUser
        });

        await user.save();
        res.status(201).send('Usuário registrado com sucesso.');
    } catch {
        res.status(400).send('Erro ao registrar usuário. Email ou login já existem.');
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { loginOrEmail, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }]
        });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).send('Login ou senha inválidos.');

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.email === process.env.ADMIN_EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                foto: user.foto,
                isAdmin: user.email === process.env.ADMIN_EMAIL
            }
        });
    } catch {
        res.status(500).send('Erro no servidor.');
    }
});

// --- Rotas do Catálogo ---
app.get('/api/mangas', async (req, res) => {
    try {
        const mangas = await Manga.find().populate('categories');
        res.json(mangas);
    } catch {
        res.status(500).send('Erro ao buscar mangás.');
    }
});

app.get('/api/mangas/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id).populate('categories');
        if (!manga) return res.status(404).send('Mangá não encontrado.');

        const comments = await Comment.find({ manga: req.params.id })
            .populate('user', 'nome foto')
            .sort({ createdAt: -1 });

        const ratings = await Rating.find({ manga: req.params.id });
        const avgRating = ratings.length
            ? (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(1)
            : 0;

        res.json({ manga, comments, avgRating, totalRatings: ratings.length });
    } catch {
        res.status(500).send('Erro ao buscar detalhes do mangá.');
    }
});

app.get('/api/mangas/:id/read', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id).select('title pages');
        if (!manga || !manga.pages?.length)
            return res.status(404).send('Páginas não encontradas.');
        res.json(manga);
    } catch {
        res.status(500).send('Erro ao buscar páginas do mangá.');
    }
});

// --- Interações ---
app.post('/api/mangas/:id/favorite', verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;

        const existing = await Favorite.findOne({ manga: mangaId, user: userId });
        if (existing) {
            await Favorite.findByIdAndDelete(existing._id);
            res.send('Removido dos favoritos.');
        } else {
            const favorite = new Favorite({ manga: mangaId, user: userId });
            await favorite.save();
            res.status(201).send('Adicionado aos favoritos.');
        }
    } catch {
        res.status(500).send('Erro ao processar favorito.');
    }
});

app.post('/api/mangas/:id/rate', verifyToken, async (req, res) => {
    try {
        const { score } = req.body;
        if (score < 1 || score > 10) return res.status(400).send('Nota inválida.');
        const rating = await Rating.findOneAndUpdate(
            { manga: req.params.id, user: req.user.id },
            { score },
            { new: true, upsert: true }
        );
        res.status(201).json(rating);
    } catch {
        res.status(500).send('Erro ao salvar nota.');
    }
});

app.post('/api/mangas/:id/comment', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).send('Comentário vazio.');
        const comment = new Comment({
            manga: req.params.id,
            user: req.user.id,
            content
        });
        await comment.save();
        const newComment = await Comment.findById(comment._id).populate('user', 'nome foto');
        res.status(201).json(newComment);
    } catch {
        res.status(500).send('Erro ao postar comentário.');
    }
});

// --- Rotas Admin ---
app.post('/api/admin/mangas', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, coverImage, description, author, status, categories, pages } = req.body;
        const manga = new Manga({ title, coverImage, description, author, status, categories, pages });
        await manga.save();
        res.status(201).json(manga);
    } catch {
        res.status(400).send('Erro ao adicionar mangá.');
    }
});

app.post('/api/admin/categories', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch {
        res.status(400).send('Erro ao adicionar categoria.');
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch {
        res.status(500).send('Erro ao buscar categorias.');
    }
});

// --- MyAnimeList ---
app.get('/api/mal/weekly', async (req, res) => {
    try {
        const response = await axios.get('https://api.myanimelist.net/v2/manga/ranking', {
            params: { ranking_type: 'publishing', limit: 10 },
            headers: { 'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error("Erro ao buscar MAL API:", error.response?.data || error.message);
        res.status(500).send('Erro ao buscar recomendações do MAL.');
    }
});

// --- Inicialização ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Project Nyan rodando na porta ${PORT}`);
});

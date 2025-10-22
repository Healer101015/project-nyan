require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios'); // Para a API do MAL

const app = express();
app.use(cors());
app.use(express.json());

// Importar Modelos
const User = require('./models/User');
const Manga = require('./models/Manga');
const Category = require('./models/Category');
const Rating = require('./models/Rating');
const Comment = require('./models/Comment');
const Favorite = require('./models/Favorite');

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

// --- Middlewares ---

// Middleware de autenticação (Verifica o Token JWT)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(403).send('Token é necessário.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário (id, email) ao req
        next();
    } catch (err) {
        return res.status(401).send('Token inválido.');
    }
};

// Middleware de Admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        // Verifica se o email do usuário logado é o email do admin no .env
        if (user && user.email === process.env.ADMIN_EMAIL) {
            next();
        } else {
            res.status(403).send('Acesso negado. Requer privilégios de administrador.');
        }
    } catch (error) {
        res.status(500).send('Erro ao verificar administrador.');
    }
};


// --- Rotas de Autenticação (Login/Registro) ---

app.post('/api/register', async (req, res) => {
    try {
        const { nome, email, login, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verifica se o email do admin está sendo usado para registrar
        const isAdminUser = email === process.env.ADMIN_EMAIL;

        const user = new User({
            nome,
            email,
            login,
            password: hashedPassword,
            isAdmin: isAdminUser // Define isAdmin no registro
        });
        await user.save();
        res.status(201).send('Usuário registrado com sucesso.');
    } catch (error) {
        res.status(400).send('Erro ao registrar usuário. Verifique se o email ou login já existem.');
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { loginOrEmail, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }]
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send('Login ou senha inválidos.');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.email === process.env.ADMIN_EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, nome: user.nome, email: user.email, foto: user.foto, isAdmin: user.email === process.env.ADMIN_EMAIL } });
    } catch (error) {
        res.status(500).send('Erro no servidor.');
    }
});


// --- Rotas do Catálogo (Mangás) ---

// Obter todos os mangás (Catálogo)
app.get('/api/mangas', async (req, res) => {
    try {
        const mangas = await Manga.find().populate('categories');
        res.json(mangas);
    } catch (error) {
        res.status(500).send('Erro ao buscar mangás.');
    }
});

// Obter detalhes de um mangá (incluindo notas e comentários)
app.get('/api/mangas/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id).populate('categories');
        if (!manga) return res.status(404).send('Mangá não encontrado.');

        // Buscar comentários
        const comments = await Comment.find({ manga: req.params.id })
            .populate('user', 'nome foto') // Popula nome e foto do usuário
            .sort({ createdAt: -1 });

        // Buscar notas e calcular média
        const ratings = await Rating.find({ manga: req.params.id });
        const avgRating = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
            : 0;

        res.json({ manga, comments, avgRating: avgRating.toFixed(1), totalRatings: ratings.length });
    } catch (error) {
        res.status(500).send('Erro ao buscar detalhes do mangá.');
    }
});

// Obter páginas do mangá (Leitor)
app.get('/api/mangas/:id/read', async (req, res) => {
    try {
        // Opcional: Adicionar verifyToken se a leitura exigir login
        const manga = await Manga.findById(req.params.id).select('title pages');
        if (!manga || !manga.pages || manga.pages.length === 0) {
            return res.status(404).send('Páginas não encontradas para este mangá.');
        }
        // Retorna as páginas ordenadas
        res.json(manga);
    } catch (error) {
        res.status(500).send('Erro ao buscar páginas do mangá.');
    }
});


// --- Rotas de Interação (Requer Login) ---

// Favoritar/Desfavoritar
app.post('/api/mangas/:id/favorite', verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;

        const existingFavorite = await Favorite.findOne({ manga: mangaId, user: userId });

        if (existingFavorite) {
            await Favorite.findByIdAndDelete(existingFavorite._id);
            res.send('Removido dos favoritos.');
        } else {
            const favorite = new Favorite({ manga: mangaId, user: userId });
            await favorite.save();
            res.status(201).send('Adicionado aos favoritos.');
        }
    } catch (error) {
        res.status(500).send('Erro ao processar favorito.');
    }
});

// Dar/Atualizar Nota
app.post('/api/mangas/:id/rate', verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;
        const { score, malScore } = req.body; // score (1-10), malScore (opcional)

        if (score < 1 || score > 10) {
            return res.status(400).send('Nota deve ser entre 1 e 10.');
        }

        const rating = await Rating.findOneAndUpdate(
            { manga: mangaId, user: userId },
            { score, malScore },
            { new: true, upsert: true } // Cria se não existir, atualiza se existir
        );
        res.status(201).json(rating);
    } catch (error) {
        res.status(500).send('Erro ao salvar nota.');
    }
});

// Postar Comentário
app.post('/api/mangas/:id/comment', verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) return res.status(400).send('Comentário não pode estar vazio.');

        const comment = new Comment({
            manga: mangaId,
            user: userId,
            content
        });
        await comment.save();

        // Popula o usuário antes de enviar de volta para o front-end
        const newComment = await Comment.findById(comment._id).populate('user', 'nome foto');

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).send('Erro ao postar comentário.');
    }
});

// Votar em Comentário (Upvote/Downvote)
app.post('/api/comments/:id/vote', verifyToken, async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const { voteType } = req.body; // 'upvote' ou 'downvote'

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).send('Comentário não encontrado.');

        // Lógica de Upvote/Downvote (remove o oposto se existir, adiciona/remove o atual)
        if (voteType === 'upvote') {
            comment.downvotes.pull(userId); // Remove downvote se existir
            const hasUpvoted = comment.upvotes.includes(userId);
            if (hasUpvoted) {
                comment.upvotes.pull(userId); // Remove upvote
            } else {
                comment.upvotes.push(userId); // Adiciona upvote
            }
        } else if (voteType === 'downvote') {
            comment.upvotes.pull(userId); // Remove upvote se existir
            const hasDownvoted = comment.downvotes.includes(userId);
            if (hasDownvoted) {
                comment.downvotes.pull(userId); // Remove downvote
            } else {
                comment.downvotes.push(userId); // Adiciona downvote
            }
        } else {
            return res.status(400).send('Tipo de voto inválido.');
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).send('Erro ao votar.');
    }
});


// --- Rotas de Admin (Requer Login e Admin) ---

// Adicionar Mangá
app.post('/api/admin/mangas', verifyToken, isAdmin, async (req, res) => {
    try {
        // Recebe 'pages' como um array de strings (URLs)
        const { title, coverImage, description, author, status, categories, pages } = req.body;

        const manga = new Manga({
            title,
            coverImage,
            description,
            author,
            status,
            categories, // Deve ser um array de IDs de Categoria
            pages // Array de URLs das páginas
        });

        await manga.save();
        res.status(201).json(manga);
    } catch (error) {
        res.status(400).send('Erro ao adicionar mangá.');
    }
});

// Adicionar Categoria
app.post('/api/admin/categories', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).send('Erro ao adicionar categoria.');
    }
});

// Obter todas as categorias (para o formulário de admin)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).send('Erro ao buscar categorias.');
    }
});


// --- Rota MyAnimeList (MAL) ---

// Recomendações (Melhores da Semana)
app.get('/api/mal/weekly', async (req, res) => {
    try {
        // Esta é uma chamada de exemplo. A API do MAL (v2) usa OAuth 2.0.
        // Para "melhores da semana", talvez você precise usar a API de ranking com 'ranking_type=airing' ou 'manga'
        // A API Jikan (wrapper não oficial) pode ser mais fácil se você não quiser lidar com OAuth completo.

        // Exemplo usando a API oficial (requer CLIENT_ID)
        const response = await axios.get('https://api.myanimelist.net/v2/manga/ranking', {
            params: {
                ranking_type: 'publishing', // Ou 'manga' para all time
                limit: 10
            },
            headers: {
                'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
            }
        });

        res.json(response.data.data); // Retorna os dados do ranking
    } catch (error) {
        console.error("Erro ao buscar MAL API:", error.response?.data || error.message);
        res.status(500).send('Erro ao buscar recomendações do MyAnimeList.');
    }
});


// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
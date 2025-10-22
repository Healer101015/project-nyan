// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // NOVO: Para a API do MyAnimeList

// --- Importação dos Modelos ---
// (Certifique-se que você criou estes arquivos em /models)
const User = require("./models/User"); // Seu User.js atualizado (com nome, login, foto)
const Manga = require("./models/Manga"); // Substitui o Product.js
const Comment = require("./models/Comment"); // NOVO
const Rating = require("./models/Rating"); // NOVO
const Favorite = require("./models/Favorite"); // NOVO

const app = express();
app.use(cors());
app.use(express.json());

// --- Configuração Centralizada ---
// (Idealmente, mova-os para um arquivo .env)
const MONGO_URI = "mongodb://localhost:27017/project_nyan"; // Novo banco de dados
const JWT_SECRET = "sua_chave_secreta_jwt_muito_forte"; // Mude isso!
const ADMIN_EMAIL = "admin@nyan.com"; // Defina seu email de admin
const MAL_API_KEY = "SUA_CHAVE_API_DO_MYANIMELIST_AQUI"; // NOVO: Pegue no site do MAL

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB (Project Nyan) conectado."))
    .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

///////////////////////////
// Middleware
///////////////////////////

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token mal formatado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // terá { id, email, nome }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
};

const isAdmin = (req, res, next) => {
    // req.user é definido pelo middleware verifyToken
    if (req.user.email !== ADMIN_EMAIL) {
        return res.status(403).json({ message: "Acesso negado. Rota de administrador." });
    }
    next();
};

///////////////////////////
// Rotas de Autenticação
///////////////////////////

// NOVO: Registro atualizado para incluir nome e login
app.post("/api/register", async (req, res) => {
    const { email, password, nome, login } = req.body;

    if (!email || !password || !nome || !login) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        // Checar se email ou login já existem
        let user = await User.findOne({ $or: [{ email }, { login }] });
        if (user) {
            return res.status(400).json({ error: "Email ou login já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            email,
            login,
            nome,
            password: hashedPassword,
            // 'foto' usará o valor 'default' definido no Schema
        });

        res.status(201).json({ message: "Usuário criado com sucesso!", userId: user._id });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
});

// NOVO: Login atualizado para aceitar 'login' ou 'email'
app.post("/api/login", async (req, res) => {
    const { loginOrEmail, password } = req.body;

    if (!loginOrEmail || !password) {
        return res.status(400).json({ error: "Credenciais necessárias" });
    }

    try {
        const user = await User.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Inclui mais dados no token para uso no frontend
        const token = jwt.sign(
            { id: user._id, email: user.email, nome: user.nome, login: user.login },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// Rota para verificar o token e pegar dados do usuário logado
app.get("/api/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").lean(); // .lean() para objeto JS puro
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const isAdmin = user.email === ADMIN_EMAIL;
        res.json({ user: { ...user, isAdmin } });
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados do usuário" });
    }
});

///////////////////////////
// Rotas de Admin (Mangás)
///////////////////////////

// NOVO: Rota para admin adicionar mangás (substitui /admin/products)
app.post("/api/admin/mangas", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, description, imageUrl, category, author, status, volumes, pages } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Nome e Categoria são obrigatórios" });
        }

        const newManga = new Manga({
            name,
            description,
            imageUrl,
            category,
            author,
            status,
            volumes,
            pages // Array de URLs das páginas para o leitor
        });
        await newManga.save();

        res.status(201).json(newManga);
    } catch (error) {
        console.error("Erro ao criar mangá:", error);
        res.status(500).json({ message: "Erro ao criar mangá" });
    }
});

// TODO: Adicionar rotas para Admin (PUT, DELETE)
// app.put("/api/admin/mangas/:id", verifyToken, isAdmin, ...);
// app.delete("/api/admin/mangas/:id", verifyToken, isAdmin, ...);

///////////////////////////
// Rotas Públicas (Catálogo)
///////////////////////////

// Rota para listar todos os mangás no catálogo
app.get("/api/mangas", async (req, res) => {
    try {
        const mangas = await Manga.find();
        res.json(mangas);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar mangás" });
    }
});

// NOVO: Rota para ver detalhes de um mangá específico (estilo Letterboxd)
app.get("/api/mangas/:id", async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: "Mangá não encontrado" });
        }

        // Buscar dados relacionados
        const comments = await Comment.find({ manga: req.params.id })
            .populate("user", "nome foto login") // Puxa dados do usuário
            .sort({ createdAt: -1 });

        const ratings = await Rating.find({ manga: req.params.id });

        // Calcular nota média
        let averageRating = 0;
        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, r) => acc + r.score, 0);
            averageRating = (sum / ratings.length).toFixed(1);
        }

        res.json({ manga, comments, ratings, averageRating });
    } catch (err) {
        console.error("Erro ao buscar detalhes do mangá:", err);
        res.status(500).json({ message: "Erro ao buscar detalhes do mangá" });
    }
});

////////////////////////////////////////
// Rotas de Interação (Requer Login)
////////////////////////////////////////

// --- FAVORITOS ---
app.post("/api/mangas/:id/favorite", verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;

        const existing = await Favorite.findOne({ manga: mangaId, user: userId });

        if (existing) {
            // Se já existe, remove (toggle off)
            await Favorite.findByIdAndDelete(existing._id);
            res.json({ favorited: false, message: "Removido dos favoritos" });
        } else {
            // Se não existe, cria (toggle on)
            await Favorite.create({ manga: mangaId, user: userId });
            res.status(201).json({ favorited: true, message: "Adicionado aos favoritos" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erro ao processar favorito" });
    }
});

// --- NOTAS (RATINGS) ---
app.post("/api/mangas/:id/rate", verifyToken, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const userId = req.user.id;
        const { score } = req.body; // Nota (ex: 8)

        if (!score || score < 1 || score > 10) {
            return res.status(400).json({ message: "Nota deve ser um número entre 1 e 10." });
        }

        // 'findOneAndUpdate' com 'upsert: true' atualiza a nota se existe, ou cria se não existe.
        const rating = await Rating.findOneAndUpdate(
            { manga: mangaId, user: userId },
            { score: score },
            { new: true, upsert: true }
        );

        res.status(201).json(rating);
    } catch (err) {
        res.status(500).json({ message: "Erro ao salvar nota" });
    }
});

// --- COMENTÁRIOS ---
app.post("/api/mangas/:id/comment", verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comentário não pode estar vazio." });
        }

        const comment = await Comment.create({
            manga: req.params.id,
            user: req.user.id,
            content: content,
        });

        // Retorna o comentário já com os dados do usuário
        const populatedComment = await Comment.findById(comment._id).populate(
            "user",
            "nome foto login"
        );

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar comentário" });
    }
});

// --- VOTOS (UPVOTE/DOWNVOTE) ---
app.post("/api/comments/:id/vote", verifyToken, async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const { voteType } = req.body; // "up" ou "down"

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comentário não encontrado." });
        }

        const upvoted = comment.upvotes.includes(userId);
        const downvoted = comment.downvotes.includes(userId);

        if (voteType === "up") {
            comment.downvotes.pull(userId); // Remove do downvote
            if (upvoted) {
                comment.upvotes.pull(userId); // Tira o upvote (neutral)
            } else {
                comment.upvotes.push(userId); // Adiciona upvote
            }
        } else if (voteType === "down") {
            comment.upvotes.pull(userId); // Remove do upvote
            if (downvoted) {
                comment.downvotes.pull(userId); // Tira o downvote (neutral)
            } else {
                comment.downvotes.push(userId); // Adiciona downvote
            }
        } else {
            return res.status(400).json({ message: "Tipo de voto inválido" });
        }

        await comment.save();
        res.json(comment); // Retorna o comentário atualizado com as contagens
    } catch (err) {
        res.status(500).json({ message: "Erro ao votar" });
    }
});

///////////////////////////
// Rotas de Perfil (Públicas)
///////////////////////////

// NOVO: Rota para ver o perfil de um usuário e suas atividades
app.get("/api/profile/:login", async (req, res) => {
    try {
        // Busca o usuário pelo 'login' (username)
        const user = await User.findOne({ login: req.params.login }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Buscar atividades públicas desse usuário
        const favorites = await Favorite.find({ user: user._id }).populate("manga", "name imageUrl");
        const ratings = await Rating.find({ user: user._id }).populate("manga", "name imageUrl");
        const comments = await Comment.find({ user: user._id }).populate("manga", "name");

        res.json({ user, favorites, ratings, comments });
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar perfil." });
    }
});


///////////////////////////
// Rota Externa (MyAnimeList)
///////////////////////////

// NOVO: Rota para recomendações (Melhores da Semana)
app.get("/api/mal/top-weekly", async (req, res) => {
    if (MAL_API_KEY === "SUA_CHAVE_API_DO_MYANIMELIST_AQUI") {
        return res.status(500).json({ message: "API Key do MyAnimeList não configurada no servidor." });
    }

    try {
        // Exemplo: 'ranking_type=all' (pode ser 'manga', 'oneshots', etc.)
        // 'fields' pede dados extras como a sinopse e a capa
        const url = "https://api.myanimelist.net/v2/manga/ranking?ranking_type=all&limit=10&fields=main_picture,synopsis,num_chapters";

        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${MAL_API_KEY}` } // A API v2 do MAL usa Bearer Token
        });

        // A API do MAL retorna os dados dentro de { data: [ { node: {...} }, ... ] }
        const recommendations = response.data.data.map(item => item.node);

        res.json(recommendations);
    } catch (error) {
        // Log detalhado do erro da API externa
        console.error("Erro ao buscar dados do MAL:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Erro ao buscar recomendações do MAL." });
    }
});


///////////////////////////
// Inicialização do Servidor
///////////////////////////

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor Project Nyan rodando na porta ${PORT}`);
});
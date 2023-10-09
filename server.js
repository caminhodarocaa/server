// NodeJs
// MongoDB 

// Importações de módulos e configurações iniciais
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Carregar variáveis de ambiente a partir de um arquivo .env

const app = express();
const port = 3000;

// Importação de rotas personalizadas
const loginRoutes = require("./routes/User/Login/login");
const newUserRoutes = require("./routes/User/NewUser/newUser");
const perfilImage = require("./routes/User/PerfilImage/perfilImage");
const perfilRoutes = require("./routes/Perfil/perfil");
const newEcotourism = require("./routes/Ecotourism/ecotourism");

// Configurações de middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
	});

// Rota de teste para verificar se o servidor está funcionando
app.get("/", (req, res) => {
	console.log("Hello World!");
	res.send("Hello World!");
});

// Mapeamento de rotas para diferentes funcionalidades
app.use("/api/users", newUserRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/perfilImage", perfilImage);
app.use("/api/new_ecotourism", newEcotourism);

// Iniciar o servidor na porta especificada
app.listen(port, () => {
	console.log(`Servidor está ouvindo na porta: ${port}`);
});

const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../../../models/User/User");

// Rota para autenticar um usuário com base no email e senha
router.post("/", async (req, res) => {
	try {
		const { email, senha } = req.body;

		// Procurar o usuário pelo email
		const user = await User.findOne({ email });

		if (!user) {
			// Se o usuário não for encontrado, retornar um erro 404
			return res.status(404).json({ error: "User not found" });
		}

		// Verificar se a senha fornecida corresponde à senha armazenada no banco de dados
		const isPasswordMatch = await bcrypt.compare(senha, user.senha);

		if (!isPasswordMatch) {
			// Se a senha não corresponder, retornar um erro 401 (não autorizado)
			return res.status(401).json({ error: "Invalid password" });
		}

		const userId = user._id;

		res.json({ message: "Login successful", userId });
	} catch (err) {
		// Lidar com erros e retornar um erro 500 (erro interno do servidor) em caso de problemas
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

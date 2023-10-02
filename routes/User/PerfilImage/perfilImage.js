const express = require("express");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();
const saltRounds = 10;

const User = require("../../../models/User/User");

// Rota para atualizar a URL da imagem de um usuário existente
router.put("/:userId", async (req, res) => {
	try {
		// Extrair o ID do usuário dos parâmetros da URL
		const { userId } = req.params;
		// Extrair a nova URL da imagem do corpo da solicitação
		const { userImageURL } = req.body;

		// Encontrar o usuário pelo ID
		const user = await User.findById(userId);

		if (!user) {
			// Se o usuário não for encontrado, retornar um erro 404
			return res.status(404).json({ error: "User not found" });
		}

		// Atualizar a URL da imagem do usuário
		user.userImageURL = userImageURL;

		// Salvar as alterações no banco de dados
		await user.save();

		// Responder com uma mensagem de sucesso
		res.json({ message: "User image URL updated successfully" });
	} catch (err) {
		// Lidar com erros e retornar um erro 500 (erro interno do servidor) em caso de problemas
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

const User = require("../../models/User/User");
const Ecotourism = require("../../models/Ecotourism/Ecotourism");

// Rota para obter informações de um usuário por ID
router.post("/", async (req, res) => {
	const userId = req.body.userId;

	try {
		// Encontrar o usuário pelo ID
		const user = await User.findOne({ _id: new ObjectId(userId) });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Extrair informações relevantes do usuário
		const nome = user.nome;
		const role = user.role;
		const userImageURL = user.userImageURL;
		const email = user.email;
		res.json({ nome, role, userImageURL, email });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Rota para adicionar/atualizar a função de um usuário
router.post("/add_role", async (req, res) => {
	const userId = req.body.userId;
	const newRole = req.body.role;

	try {
		// Encontrar o usuário pelo ID
		const user = await User.findOne({ _id: new ObjectId(userId) });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Atualizar o papel (role) do usuário
		user.role = newRole;

		// Salvar as alterações no banco de dados
		await user.save();

		return res.status(200).json({ message: "Role updated successfully" });
	} catch (error) {
		console.error("Error updating role:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Rota para obter locais de ecoturismo associados a um usuário
router.post("/get_ecotourism", async (req, res) => {
	const userId = req.body.userId;

	try {
		// Encontrar locais de ecoturismo associados ao usuário pelo ID do usuário
		const ecotourism = await Ecotourism.find({ user_id: userId });
		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism not found" });
		}

		// Formatar os resultados para incluir apenas informações relevantes
		const resultArray = ecotourism.map((item) => ({
			nome_propriedade: item.nome_propriedade,
			endereco: item.endereco,
			propriedadeImageURL: Array.isArray(item.propriedadeImageURL) ? item.propriedadeImageURL.join(", ") : item.propriedadeImageURL,
			_id: item._id,
		}));

		res.status(200).json(resultArray);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;

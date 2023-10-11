const express = require("express");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();
const saltRounds = 10;

const User = require("../../../models/User/User");

router.post("/", async (req, res) => {
	try {
		// Extrair informações do corpo da solicitação
		const { nome, email, senha, telefone, cpf, data_nascimento, userImageURL } = req.body;

		// Hash da senha do usuário para armazenamento seguro no banco de dados
		const hashedPassword = await bcrypt.hash(senha, saltRounds);

		// Criar um novo objeto de usuário com as informações fornecidas
		const newUser = new User({
			nome,
			email,
			senha: hashedPassword,
			telefone,
			cpf,
			data_nascimento,
			userImageURL,
		});

		// Salvar o novo usuário no banco de dados
		await newUser.save();

		res.json({ message: "User created successfully" });
	} catch (err) {
		// Lidar com erros e retornar um erro 500 (erro interno do servidor) em caso de problemas
		res.status(500).json({ error: err.message });
	}
});

router.post("/reset-password", async (req, res) => {
		try {
			// Extrai o email e a senha do body
			const { email, newPassword } = req.body;

			// Verifica se o Email existe no bd
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			// Hash a nova senha
			const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

			// Update a senha do BD
			user.senha = hashedPassword;
			await user.save();

			res.json({ message: "Password reset successful" });
		} catch (err) {
			
			res.status(500).json({ error: err.message });
		}
	});

module.exports = router;

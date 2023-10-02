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

module.exports = router;

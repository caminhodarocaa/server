const express = require("express");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();
const saltRounds = 10;

const User = require("../../../models/User/User");

router.post("/", async (req, res) => {
	try {
		const { nome, email, senha, telefone, cpf, rg, data_nascimento, userImageURL } = req.body;
		const hashedPassword = await bcrypt.hash(senha, saltRounds);
		const newUser = new User({
			nome,
			email,
			senha: hashedPassword,
			telefone,
			cpf,
			rg,
			data_nascimento,
			userImageURL,
		});

		await newUser.save();

		res.json({ message: "User created successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

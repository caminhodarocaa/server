const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

const Ecotourism = require("../../models/Ecotourism/Ecotourism");

router.post("/", async (req, res) => {
	try {
		const { nome_propriedade, endereco, cep, bairro, sigla_uf, municipio, localisacao_geografica, user_id } = req.body;
		const newEcotourism = new Ecotourism({
			nome_propriedade,
			endereco,
			cep,
			bairro,
			sigla_uf,
			municipio,
			localisacao_geografica,
			user_id,
		});

		await newEcotourism.save();

		res.json({ message: "new Ecotourism place created successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

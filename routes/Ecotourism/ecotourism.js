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

		res.json({ message: "New Ecotourism place created successfully", id: newEcotourism._id });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/new_images/:user_id/:idEcotourism", async (req, res) => {
	try {
		const { user_id, idEcotourism } = req.params;
		const { propriedadeImageURL } = req.body;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "User not found" });
		}

		ecotourism.propriedadeImageURL = propriedadeImageURL;

		await ecotourism.save();

		res.json({ message: "Ecotourism image URL updated successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
 
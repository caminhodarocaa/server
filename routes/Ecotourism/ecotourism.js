const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const { getDistance } = require("geolib");

const router = express.Router();

const Ecotourism = require("../../models/Ecotourism/Ecotourism");

router.post("/", async (req, res) => {
	try {
		const { nome_propriedade, endereco, cep, bairro, sigla_uf, municipio, localisacao_geografica, user_id, tipo } = req.body;
		const newEcotourism = new Ecotourism({
			nome_propriedade,
			endereco,
			cep,
			bairro,
			sigla_uf,
			municipio,
			localisacao_geografica,
			user_id,
			tipo,
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

router.post("/near_ecotourism/:latitude/:longitude/:dist", async (req, res) => {
	try {
		const { latitude, longitude } = req.params;

		if (!latitude || !longitude) {
			return res.status(400).json({ error: "Latitude and longitude are required." });
		}

		const latitudeReferencia = parseFloat(latitude);
		const longitudeReferencia = parseFloat(longitude);

		const ecotourismPlaces = await Ecotourism.find();

		const ecotourismPlacesNearby = ecotourismPlaces.filter((place) => {
			const distancia = getDistance(
				{ latitude: latitudeReferencia, longitude: longitudeReferencia },
				{ latitude: place.localisacao_geografica.coordinates[0], longitude: place.localisacao_geografica.coordinates[1] }
			);
			return distancia <= req.params.dist * 1000;
		});

		res.status(200).json({ ecotourismPlacesNearby });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/near_ecotourism/:latitude/:longitude/:dist", async (req, res) => {
	try {
		const { latitude, longitude } = req.params;

		if (!latitude || !longitude) {
			return res.status(400).json({ error: "Latitude and longitude are required." });
		}

		const latitudeReferencia = parseFloat(latitude);
		const longitudeReferencia = parseFloat(longitude);

		const ecotourismPlaces = await Ecotourism.find();

		const ecotourismPlacesNearby = ecotourismPlaces.filter((place) => {
			const distancia = getDistance(
				{ latitude: latitudeReferencia, longitude: longitudeReferencia },
				{ latitude: place.localisacao_geografica.coordinates[0], longitude: place.localisacao_geografica.coordinates[1] }
			);
			console.log(req.params.dist);
			return distancia <= req.params.dist * 1000;
		});

		res.status(200).json({ ecotourismPlacesNearby });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/add_comment/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;
		const { text, comment_user_id, active } = req.body;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		ecotourism.comments.push({ text: text, comment_user_id, active });

		await ecotourism.save();

		res.json({ message: "Comment added successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/disable_comment/:idEcotourism/:commentId", async (req, res) => {
	try {
		const { idEcotourism, commentId } = req.params;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		const comment = ecotourism.comments.id(commentId);

		if (!comment) {
			return res.status(404).json({ error: "Comment not found" });
		}

		comment.active = false;

		await ecotourism.save();

		res.json({ message: "Comment disabled successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/find_ecotourism/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		res.status(200).json({ ecotourism });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.put("/edit_ecotourism/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;
		const { nome_propriedade, endereco, cep, bairro, sigla_uf, municipio, localisacao_geografica, user_id, tipo } = req.body;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		ecotourism.nome_propriedade = nome_propriedade;
		ecotourism.endereco = endereco;
		ecotourism.cep = cep;
		ecotourism.bairro = bairro;
		ecotourism.sigla_uf = sigla_uf;
		ecotourism.municipio = municipio;
		ecotourism.localisacao_geografica = localisacao_geografica;
		ecotourism.user_id = user_id;
		ecotourism.tipo = tipo;

		await ecotourism.save();

		res.json({ message: "Ecotourism place updated successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.get("/search_ecotourism/:keyword", async (req, res) => {
	try {
		const { keyword } = req.params;

		if (!keyword) {
			return res.status(400).json({ error: "Keyword is required for searching." });
		}

		const ecotourismPlaces = await Ecotourism.find({
			nome_propriedade: { $regex: keyword, $options: "i" },
		});

		res.status(200).json({ ecotourismPlaces });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});



module.exports = router;
 
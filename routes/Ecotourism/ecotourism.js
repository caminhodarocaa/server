const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const { getDistance } = require("geolib");

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
		const { text, comment_user_id } = req.body;

		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		ecotourism.comments.push({ text: text, comment_user_id });

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


module.exports = router;
 
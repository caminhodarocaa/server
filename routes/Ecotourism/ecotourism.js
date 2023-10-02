const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const { getDistance } = require("geolib");

const router = express.Router();

const Ecotourism = require("../../models/Ecotourism/Ecotourism");

// Criar um novo local de ecoturismo
router.post("/", async (req, res) => {
	try {
		// Extrair dados do corpo da solicitação
		const { nome_propriedade, endereco, cep, bairro, sigla_uf, municipio, localisacao_geografica, user_id, tipo } = req.body;
		// Criar um novo objeto Ecotourism
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

		// Salvar o novo objeto no banco de dados
		await newEcotourism.save();

		res.json({ message: "New Ecotourism place created successfully", id: newEcotourism._id });
	} catch (err) {
		// Lidar com erros e enviar uma resposta de erro
		res.status(500).json({ error: err.message });
	}
});

// Atualizar a URL da imagem do local de ecoturismo
router.post("/new_images/:user_id/:idEcotourism", async (req, res) => {
	try {
		// Extrair parâmetros da solicitação
		const { user_id, idEcotourism } = req.params;
		const { propriedadeImageURL } = req.body;

		// Encontrar o local de ecoturismo pelo ID
		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "User not found" });
		}

		// Atualizar a URL da imagem do local de ecoturismo
		ecotourism.propriedadeImageURL = propriedadeImageURL;

		// Salvar as alterações no banco de dados
		await ecotourism.save();

		res.json({ message: "Ecotourism image URL updated successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Encontrar locais de ecoturismo próximos com base na latitude, longitude e distância
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

// Adicionar um comentário a um local de ecoturismo
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

// Desativar um comentário de um local de ecoturismo
router.post("/add_comment/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;
		const { text, comment_user_id, active } = req.body;

		// Encontrar o local de ecoturismo pelo ID
		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		// Adicionar um novo comentário ao local de ecoturismo
		ecotourism.comments.push({ text: text, comment_user_id, active });

		// Salvar as alterações no banco de dados
		await ecotourism.save();

		res.json({ message: "Comment added successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Encontrar um local de ecoturismo pelo ID
router.post("/disable_comment/:idEcotourism/:commentId", async (req, res) => {
	try {
		const { idEcotourism, commentId } = req.params;

		// Encontrar o local de ecoturismo pelo ID
		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		const comment = ecotourism.comments.id(commentId);

		if (!comment) {
			return res.status(404).json({ error: "Comment not found" });
		}

		comment.active = false;

		// Salvar as alterações no banco de dados
		await ecotourism.save();

		res.json({ message: "Comment disabled successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Editar informações de um local de ecoturismo
router.post("/find_ecotourism/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;

		// Encontrar o local de ecoturismo pelo ID
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

// Editar informações de um local de ecoturismo
router.put("/edit_ecotourism/:idEcotourism", async (req, res) => {
	try {
		const { idEcotourism } = req.params;
		const { nome_propriedade, endereco, cep, bairro, sigla_uf, municipio, localisacao_geografica, user_id, tipo } = req.body;

		// Encontrar o local de ecoturismo pelo ID
		const ecotourism = await Ecotourism.findById(idEcotourism);

		if (!ecotourism) {
			return res.status(404).json({ error: "Ecotourism place not found" });
		}

		// Atualizar os dados do local de ecoturismo
		ecotourism.nome_propriedade = nome_propriedade;
		ecotourism.endereco = endereco;
		ecotourism.cep = cep;
		ecotourism.bairro = bairro;
		ecotourism.sigla_uf = sigla_uf;
		ecotourism.municipio = municipio;
		ecotourism.localisacao_geografica = localisacao_geografica;
		ecotourism.user_id = user_id;
		ecotourism.tipo = tipo;

		// Salvar as alterações no banco de dados
		await ecotourism.save();

		res.json({ message: "Ecotourism place updated successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Pesquisar locais de ecoturismo com base em uma palavra-chave
router.get("/search_ecotourism/:keyword", async (req, res) => {
	try {
		const { keyword } = req.params;

		if (!keyword) {
			return res.status(400).json({ error: "Keyword is required for searching." });
		}

		// Pesquisar locais de ecoturismo que correspondam à palavra-chave
		const ecotourismPlaces = await Ecotourism.find({
			nome_propriedade: { $regex: keyword, $options: "i" },
		});

		res.status(200).json({ ecotourismPlaces });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Exporta as fuções para o router
module.exports = router;
 
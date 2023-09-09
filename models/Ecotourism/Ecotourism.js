const mongoose = require("mongoose");

const ecotourismSchema = new mongoose.Schema({
	nome_propriedade: {
		type: String,
		required: true,
	},
	endereco: {
		type: String,
		required: false,
	},
	cep: {
		type: String,
		required: false,
	},
	bairro: {
		type: String,
		required: false,
	},
	sigla_uf: {
		type: String,
		required: false,
	},
	municipio: {
		type: String,
		required: false,
	},
	localisacao_geografica: {
		type: { type: String },
		coordinates: [Number],
	},
	user_id: {
		type: String,
		required: true,
	},
	propriedadeImageURL: {
		type: [String],
		required: false,
	},
});

const Ecotourism = mongoose.model("Ecotourism", ecotourismSchema);

module.exports = Ecotourism;

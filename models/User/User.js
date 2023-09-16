const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true,
	},
	senha: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cpf: {
		type: Number,
		required: true,
	},
	telefone: {
		type: Number,
		required: true,
	},
	data_nascimento: {
		type: Number,
		required: true,
	},
	userImageURL: {
		type: String,
		required: false,
	},
	role: {
		type: String,
		required: false,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;

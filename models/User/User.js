const mongoose = require("mongoose");

// Definindo o esquema para a entidade de Usuario
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
		type: String,
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

// Criando o modelo "User" com base no esquema
const User = mongoose.model("User", userSchema);

// Exportando o modelo
module.exports = User;

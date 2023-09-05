// NodeJs
// MongoDB 
// teste

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const loginRoutes = require("./routes/User/Login/login");
const newUserRoutes = require("./routes/User/NewUser/newUser");
const perfilImage = require("./routes/User/PerfilImage/perfilImage");
const perfilRoutes = require("./routes/Perfil/perfil");

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
	});

app.get("/api", (req, res) => {
	console.log("Hello World!");
	res.send("Hello World!");
});

app.use("/api/users", newUserRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/perfilImage", perfilImage);

app.listen(port, () => {
	console.log(`Servidor está ouvindo na porta: ${port}`);
});

const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../../../models/User/User");

router.post("/", async (req, res) => {
	try {
		const { email, senha } = req.body;
		console.log(req.body);

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const isPasswordMatch = await bcrypt.compare(senha, user.senha);

		if (!isPasswordMatch) {
			return res.status(401).json({ error: "Invalid password" });
		}

		const userId = user._id;

		res.json({ message: "Login successful", userId });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

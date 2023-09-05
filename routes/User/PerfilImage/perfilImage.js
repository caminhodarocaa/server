const express = require("express");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();
const saltRounds = 10;

const User = require("../../../models/User/User");

router.put("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { userImageURL } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		user.userImageURL = userImageURL;

		await user.save();

		res.json({ message: "User image URL updated successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

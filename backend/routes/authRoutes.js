const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");

router.post("/register", register);

// router.post("/register", (req, res) => {
//   res.status(200).json({ message: "Registered successfully" });
// });

router.post("/login", login);

module.exports = router;

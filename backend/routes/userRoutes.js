const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const {
  getProfile,
  updateProfile,
  deleteProfile,
  getTopDetectives,
  getLeaderboard,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);

router.delete("/profile", protect, deleteProfile);

router.get("/landing", getTopDetectives);

// router.get("/leaderboard", getLeaderboard);

router.get("/leaderboard", userController.getLeaderboard);
module.exports = router;

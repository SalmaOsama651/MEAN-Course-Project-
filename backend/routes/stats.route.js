const express = require("express");

const statsController = require("../controllers/stats.controller.js");

const statsRouter = express.Router();

statsRouter.get("/leaderboard", statsController.getLeaderboard);
statsRouter.get("/cases/:id/stats", statsController.getCaseStats);

module.exports = statsRouter;
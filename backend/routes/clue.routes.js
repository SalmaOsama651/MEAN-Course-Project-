const express = require("express");
const clueController = require("../controllers/clue.controller.js")

const clueRoutes = express.Router();

clueRoutes.post("/", clueController.createClue);
clueRoutes.get("/", clueController.getClues);
clueRoutes.put("/:id", clueController.updateClue);
clueRoutes.delete("/:id", clueController.deleteClue);

module.exports = clueRoutes;
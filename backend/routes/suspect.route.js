const express = require("express");
const suspectController = require("../controllers/suspect.controller.js");

const suspectsRouter = express.Router();

suspectsRouter.post("/", suspectController.addSuspect);
suspectsRouter.get("/", suspectController.getSuspects);
suspectsRouter.put("/:id", suspectController.updateSuspect);
suspectsRouter.delete("/:id", suspectController.deleteSuspect);

module.exports = suspectsRouter;
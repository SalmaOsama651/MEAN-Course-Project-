const express = require("express");
const questionController = require("../controllers/question.controller.js")

const questionRoutes = express.Router();

questionRoutes.post("/", questionController.createQuestion);
questionRoutes.get("/", questionController.getQuestions);
questionRoutes.put("/:id", questionController.updateQuestion);
questionRoutes.delete("/:id", questionController.deleteQuestion);

module.exports = questionRoutes;
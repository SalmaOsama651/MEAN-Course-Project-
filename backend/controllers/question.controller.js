const questionService = require("../services/question.service.js");

const createQuestion = async (req, res) => {
    try {
        const question = await questionService.createQuestion(req.body);

        res.status(201).json({
            message: "Question created successfully",
            question,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating question",
            error: error.message,
        });
    }
};

const getQuestions = async (req, res) => {
    try {
        const { caseId } = req.query;

        const questions = await questionService.getQuestions(caseId);

        res.status(200).json({
            questions,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting questions",
            error: error.message,
        });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await questionService.updateQuestion(
            id,
            req.body
        );

        res.status(200).json({
            message: "Question updated successfully",
            question,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating question",
            error: error.message,
        });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await questionService.deleteQuestion(id);

        res.status(200).json({
            message: "Question deleted successfully",
            question,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting question",
            error: error.message,
        });
    }
};

module.exports = {
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion,
};
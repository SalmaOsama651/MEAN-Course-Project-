const clueService = require("../services/clue.service.js");

const createClue = async (req, res) => {
    try {
        const clue = await clueService.createClue(req.body);

        res.status(201).json({
            message: "Clue created successfully",
            clue,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating clue",
            error: error.message,
        });
    }
};

const getClues = async (req, res) => {
    try {
        const { caseId } = req.query;

        const clues = await clueService.getClues(caseId);

        res.status(200).json({
            clues,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting clues",
            error: error.message,
        });
    }
};

const updateClue = async (req, res) => {
    try {
        const { id } = req.params;

        const clue = await clueService.updateClue(id, req.body);

        res.status(200).json({
            message: "Clue updated successfully",
            clue,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating clue",
            error: error.message,
        });
    }
};

const deleteClue = async (req, res) => {
    try {
        const { id } = req.params;

        const clue = await clueService.deleteClue(id);

        res.status(200).json({
            message: "Clue deleted successfully",
            clue,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting clue",
            error: error.message,
        });
    }
};

module.exports = {
    createClue,
    getClues,
    updateClue,
    deleteClue,
};
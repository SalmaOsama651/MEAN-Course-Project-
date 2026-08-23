const Clue = require("../models/clue.model.js");

const createClue = async (data) => {
    const clue = await Clue.create(data);
    return clue;
};

const createManyClues = async (clues) => {
    const createdClues = await Clue.insertMany(clues);
    return createdClues;
};

const getClues = async (caseId) => {
    const clues = await Clue.find({ caseId });
    return clues;
};

const updateClue = async (id, data) => {
    const clue = await Clue.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );

    return clue;
};

const deleteClue = async (id) => {
    const clue = await Clue.findByIdAndDelete(id);
    return clue;
};


module.exports = {
    createClue,
    createManyClues,
    getClues,
    updateClue,
    deleteClue,
};
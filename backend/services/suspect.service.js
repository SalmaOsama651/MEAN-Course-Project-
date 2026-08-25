const { suspectModel } = require("../models/suspect.model.js");

const createSuspect = async (data) => {
    return await suspectModel.create(data);
};

const getSuspectsByCase = async (caseId) => {
    return await suspectModel.find({ caseId });
};

const updateSuspect = async (id, data) => {
    return await suspectModel.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
};

const deleteSuspect = async (id) => {
    return await suspectModel.findByIdAndDelete(id);
};

module.exports = {
    createSuspect,
    getSuspectsByCase,
    updateSuspect,
    deleteSuspect,
};
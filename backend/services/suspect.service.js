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

const createManySuspects = async (suspects) => {
    return await suspectModel.insertMany(suspects);
};

const deleteSuspectsByCase = async (caseId) => {
    return await suspectModel.deleteMany({ caseId });
};

module.exports = {
    createSuspect,
    getSuspectsByCase,
    updateSuspect,
    deleteSuspect,
    createManySuspects,
    deleteSuspectsByCase,
};
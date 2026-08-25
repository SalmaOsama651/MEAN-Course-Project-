const Question = require("../models/question.model.js");

const createQuestion = async (data) => {
    const question = await Question.create(data);
    return question;
};

const createManyQuestions = async (questions) => {
    const createdQuestions = await Question.insertMany(questions);
    return createdQuestions;
};

const getQuestions = async (caseId) => {
    const questions = await Question.find({ caseId });
    return questions;
};

const updateQuestion = async (id, data) => {
    const question = await Question.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );

    return question;
};

const deleteQuestion = async (id) => {
    const question = await Question.findByIdAndDelete(id);
    return question;
};

module.exports = {
    createQuestion,
    createManyQuestions,
    getQuestions,
    updateQuestion,
    deleteQuestion,
};
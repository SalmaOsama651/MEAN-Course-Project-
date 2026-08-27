const Case = require("../models/cases.models.js");

const { suspectModel } = require("../models/suspect.model.js");
const Clue = require("../models/clue.model.js");
const Question = require("../models/question.model.js");
const clueService = require("./clue.service.js");
const questionService = require("./question.service.js");
const suspectService = require("./suspect.service.js");


async function getCases(filter = {}, options = {}) {
  return await Case.find(filter)
    .skip(options.skip || 0)
    .limit(options.limit || 10);
}


async function getCaseById(id) {
  return await Case.findById(id);
}


async function getCaseDetails(id) {
  const singleCase = await Case.findById(id);

  if (!singleCase) return null;

  const [suspects, clues, questions] = await Promise.all([
    suspectModel.find({ caseId: id }),
    Clue.find({ caseId: id }).sort({ order: 1 }),
    Question.find({ caseId: id })
  ]);

  return {
    caseDetails: singleCase,
    suspects,
    clues,
    questions
  };
}


async function createCase(data) {

  const {
    clues = [],
    questions = [],
    suspects = [],
    ...caseData
  } = data;

  const newCase = await Case.create(caseData);

  const caseId = newCase._id;

  const cluesWithCaseId = clues.map(clue => ({
    ...clue,
    caseId
  }));

  const questionsWithCaseId = questions.map(question => ({
    ...question,
    caseId
  }));

  const suspectsWithCaseId = suspects.map(suspect => ({
    ...suspect,
    caseId
  }));

  const [createdClues, createdQuestions, createdSuspects] =
    await Promise.all([
      clueService.createManyClues(cluesWithCaseId),
      questionService.createManyQuestions(questionsWithCaseId),
      suspectService.createManySuspects(suspectsWithCaseId)
    ]);

  return {
    case: newCase,
    clues: createdClues,
    questions: createdQuestions,
    suspects: createdSuspects
  };
}


async function updateCase(id, data) {
  return await Case.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  );
}


async function deleteCase(id) {

  const deletedCase = await Case.findById(id);

  if (!deletedCase) {
    return null;
  }

  await Promise.all([
    clueService.deleteCluesByCase(id),
    questionService.deleteQuestionsByCase(id),
    suspectService.deleteSuspectsByCase(id)
  ]);

  await Case.findByIdAndDelete(id);

  return deletedCase;
}


module.exports = {
  getCases,
  getCaseById,
  getCaseDetails,
  createCase,
  updateCase,
  deleteCase
};
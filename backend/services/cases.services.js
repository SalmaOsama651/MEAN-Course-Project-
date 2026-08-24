const Case = require("../models/cases.models.js");

async function getCases(filter = {}, options = {}) {
  return await Case.find(filter)
    .skip(options.skip || 0)
    .limit(options.limit || 10);
}

async function getCaseById(id) {
  return await Case.findById(id);
}

async function createCase(data) {
  const newCase = new Case(data);
  return await newCase.save();
}

async function updateCase(id, data) {
  return await Case.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteCase(id) {
  return await Case.findByIdAndDelete(id);
}

module.exports = { getCases, getCaseById, createCase, updateCase, deleteCase };

const caseService = require("../services/cases.services.js");

exports.getCases = async (req, res) => {
  try {
    const cases = await caseService.getCases();

    res.status(200).json({
      message: "Cases retrieved successfully",
      data: cases
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve cases",
      error: err.message
    });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const singleCase = await caseService.getCaseById(req.params.id);

    if (!singleCase) {
      return res.status(404).json({
        message: "Case not found"
      });
    }

    res.status(200).json({
      message: "Case retrieved successfully",
      data: singleCase
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve case",
      error: err.message
    });
  }
};

exports.getCaseDetails = async (req, res) => {
  try {
    const data = await caseService.getCaseDetails(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Case not found"
      });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve case details",
      error: err.message
    });
  }
};







exports.createCase = async (req, res) => {
  try {
    const newCase = await caseService.createCase(req.body);

    res.status(201).json({
      message: "Case created successfully",
      data: newCase
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create case",
      error: err.message
    });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const updated = await caseService.updateCase(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        message: "Case not found"
      });
    }

    res.status(200).json({
      message: "Case updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to update case",
      error: err.message
    });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deleted = await caseService.deleteCase(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Case not found"
      });
    }

    res.status(200).json({
      message: "Case deleted successfully"
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete case",
      error: err.message
    });
  }
};
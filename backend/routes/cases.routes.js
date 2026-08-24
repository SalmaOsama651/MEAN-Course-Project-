const express = require("express");
const router = express.Router();
const caseController = require("../controller/cases.controller.js");

router.get("/cases", caseController.getCases);
router.get("/cases/:id", caseController.getCaseById);

router.post("/admin/cases", caseController.createCase);
router.put("/admin/cases/:id", caseController.updateCase);
router.delete("/admin/cases/:id", caseController.deleteCase);

module.exports = router;


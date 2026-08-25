const suspectService = require("../services/suspect.service.js");

// POST /api/admin/suspects
const addSuspect = async (req, res) => {
    try {
        const suspect = await suspectService.createSuspect(req.body);

        res.status(201).json({
            msg: "ADD NEW SUSPECT SUCCESSFULLY",
            data: suspect,
        });
    } catch (err) {
        res.status(400).json({
            msg: "ERROR WHILE ADDING SUSPECT",
            err: err.message,
        });
    }
};

// GET /api/admin/suspects?caseId=...
const getSuspects = async (req, res) => {
    try {
        const { caseId } = req.query;

        if (!caseId) {
            return res.status(400).json({
                msg: "caseId IS REQUIRED",
            });
        }

        const suspects = await suspectService.getSuspectsByCase(caseId);

        res.status(200).json({
            msg: "FETCH SUSPECTS SUCCESSFULLY",
            data: suspects,
        });
    } catch (err) {
        res.status(500).json({
            msg: "ERROR WHILE FETCHING SUSPECTS",
            err: err.message,
        });
    }
};

// PUT /api/admin/suspects/:id
const updateSuspect = async (req, res) => {
    try {
        const suspect = await suspectService.updateSuspect(
            req.params.id,
            req.body
        );

        if (!suspect) {
            return res.status(404).json({
                msg: "SUSPECT NOT FOUND",
            });
        }

        res.status(200).json({
            msg: "UPDATE SUSPECT SUCCESSFULLY",
            data: suspect,
        });
    } catch (err) {
        res.status(400).json({
            msg: "ERROR WHILE UPDATING SUSPECT",
            err: err.message,
        });
    }
};

// DELETE /api/admin/suspects/:id
const deleteSuspect = async (req, res) => {
    try {
        const suspect = await suspectService.deleteSuspect(req.params.id);

        if (!suspect) {
            return res.status(404).json({
                msg: "SUSPECT NOT FOUND",
            });
        }

        res.status(200).json({
            msg: "DELETE SUSPECT SUCCESSFULLY",
            data: suspect,
        });
    } catch (err) {
        res.status(500).json({
            msg: "ERROR WHILE DELETING SUSPECT",
            err: err.message,
        });
    }
};

module.exports = {
    addSuspect,
    getSuspects,
    updateSuspect,
    deleteSuspect,
};
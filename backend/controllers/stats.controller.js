const statsService = require("../services/stats.service.js");

// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await statsService.getLeaderboard();

        res.status(200).json({
            msg: "FETCH LEADERBOARD SUCCESSFULLY",
            data: leaderboard,
        });
    } catch (err) {
        res.status(500).json({
            msg: "ERROR WHILE FETCHING LEADERBOARD",
            err: err.message,
        });
    }
};

// GET /api/cases/:id/stats
const getCaseStats = async (req, res) => {
    try {
        const stats = await statsService.getCaseStats(req.params.id);

        res.status(200).json({
            msg: "FETCH CASE STATS SUCCESSFULLY",
            data: stats,
        });
    } catch (err) {
        res.status(400).json({
            msg: "ERROR WHILE FETCHING CASE STATS",
            err: err.message,
        });
    }
};

module.exports = {
    getLeaderboard,
    getCaseStats,
};
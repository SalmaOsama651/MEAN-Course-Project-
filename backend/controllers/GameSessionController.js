const gameSessionService = require('../services/gameSession.service');

exports.start = async (req, res) => {
  try {
    const { caseId } = req.body;
    const session = await gameSessionService.startGame(req.user.id, caseId);
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.unlockNextClue = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await gameSessionService.unlockNextClue(sessionId, req.user.id);
    res.status(200).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.finish = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    const result = await gameSessionService.finishGame(sessionId, req.user.id, answers);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const history = await gameSessionService.getPlayerHistory(req.user.id);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
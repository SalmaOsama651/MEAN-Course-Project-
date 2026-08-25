const express = require('express');
const router = express.Router();

const gameSessionController = require('../controllers/GameSessionController');

const  verifyToken = require('../middleware/authMiddleware');

 
//http://localhost:5000/api/game/start

// POST /api/game/start
router.post('/start', verifyToken, gameSessionController.start);

// POST /api/game/unlock-clue
router.post('/unlock-clue', verifyToken, gameSessionController.unlockNextClue);

// POST /api/game/finish
router.post('/finish', verifyToken, gameSessionController.finish);

// GET /api/game/my-history
router.get('/my-history', verifyToken, gameSessionController.getMyHistory);

module.exports = router;
const mongoose = require("mongoose");
const GameSession = require('../models/GameSession');
const Question = require('../models/Question'); 
const Case = require('../models/Case');       
const User = require('../models/User');
//recording the start of the game


exports.startGame = async (userId, caseId) => {
  const newSession = new GameSession({
    userId,
    caseId,
    startTime: new Date(),
    currentClueIndex: 1
  });
  return await newSession.save();
};

// Open the next clue 

exports.unlockNextClue = async (sessionId, userId) => {
  const session = await GameSession.findOne({ _id: sessionId, userId, isCompleted: false });
  if (!session) throw new Error('The session does not exist or has already ended.');

  session.currentClueIndex += 1;
  return await session.save();
};

//finsh the game and record the end time, total score, and time taken

exports.finishGame = async (sessionId, userId, userAnswers , clientTimeTakenSeconds = null) => {
  const session = await GameSession.findOne({ _id: sessionId, userId, isCompleted: false });
  if (!session) throw new Error('The session does not exist or has already ended.');

  const caseData = await Case.findById(session.caseId);
  const questions = await Question.find({ caseId: session.caseId });
  console.log(questions);

  // calculate time taken seconds
  const endTime = new Date();
  let finalTimeTakenSeconds;
if (clientTimeTakenSeconds !== null && clientTimeTakenSeconds !== undefined) {
  finalTimeTakenSeconds = Number(clientTimeTakenSeconds);
} else {
  finalTimeTakenSeconds = Math.round((endTime - new Date(session.startTime)) / 1000);
}

  // compare answers and calculate score
  let earnedScore = 0;
  const detailedAnswers = [];

  for (const q of questions) {
    const userAnswerObj = userAnswers.find(a => a.questionId.toString() === q._id.toString());
    const isCorrect = userAnswerObj && userAnswerObj.selectedAnswer === q.correctAnswer;

    if (isCorrect) {
      earnedScore += (q.points || 25 );
    }

    detailedAnswers.push({
      questionId: q._id,
      questionText: q.questionText,
      selectedAnswer: userAnswerObj ? userAnswerObj.selectedAnswer : null,
      correctAnswer: q.correctAnswer,
      isCorrect: !!isCorrect
    });
  }

  // update the session 
  session.endTime = endTime;
  session.timeTakenSeconds = finalTimeTakenSeconds;
  session.totalScore = earnedScore;
  session.answers = userAnswers;
  session.isCompleted = true;
  await session.save();

  // Update the player's total points in the User Collection

  await User.findByIdAndUpdate(userId, {
    $inc: { totalScore: earnedScore }
  });

  return {
    totalScore: earnedScore,
    timeTakenSeconds: finalTimeTakenSeconds,
    detailedAnswers,
    fullSolutionStory: caseData.fullSolutionStory
  };
};

// the player's case history

exports.getPlayerHistory = async (userId) => {
  return await GameSession.find({ userId, isCompleted: true })
    .populate('caseId', 'title difficulty')
    .sort({ createdAt: -1 });
};





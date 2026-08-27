const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
      required: true,
    },
    selectedAnswer: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const gameSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cases",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    currentClueIndex: {
      type: Number,
      default: 1,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    answers: [answerSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "GameSessions", timestamps: true },
);

const gameSessionModel = mongoose.model(
  "GameSessions",
  gameSessionSchema,
  "GameSessions",
);
module.exports = gameSessionModel;

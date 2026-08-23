const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Cases",
        },

        questionType: {
            type: String,
            required: true,
            enum: ["who", "why", "how"],
        },

        questionText: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
        },

        correctAnswer: {
            type: String,
            required: true,
        },

        points: {
            type: Number,
            required: true,
        },
    }
);

const Question = mongoose.model("Questions", questionSchema, "Questions");

module.exports = Question;
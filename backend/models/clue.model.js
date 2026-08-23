const mongoose = require("mongoose");

const clueSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cases",
    },

    order: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    content: {
        type: String,
        required: true,
        trim: true,
    },
});

const Clue = mongoose.model("Clues", clueSchema, "Clues");
module.exports = Clue;
const mongoose = require("mongoose");

const suspectSchema = new mongoose.Schema(
    {
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Cases"
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        role: {
            type: String,
            required: true,
            enum: {
                values: ["suspect", "witness", "victim", "accomplice"],
                message: "Role must be: suspect, witness, victim or accomplice",
            },
        },
        statement: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            required: false,
            default: "https://via.placeholder.com/150",
        },
    }
);

const suspectModel = mongoose.model("Suspects", suspectSchema, "Suspects");
module.exports = { suspectModel };
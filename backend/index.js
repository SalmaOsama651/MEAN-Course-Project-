const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();

const clueRoutes = require("./routes/clue.routes.js");
const questionRoutes = require("./routes/question.routes.js");
const suspectsRouter = require("./routes/suspect.route.js");


const app = express();
app.use(express.json());

app.use("/api/admin/clues", clueRoutes);
app.use("/api/admin/questions", questionRoutes);
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
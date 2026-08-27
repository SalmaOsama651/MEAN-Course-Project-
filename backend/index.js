require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/cases.routes.js");
const clueRoutes = require("./routes/clue.routes.js");
const questionRoutes = require("./routes/question.routes.js");
const gameSessionRoutes = require("./routes/gameSession.routes.js");
const suspectsRouter = require("./routes/suspect.route.js");
const statsRouter = require("./routes/stats.route.js");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", caseRoutes);
app.use("/api/admin/clues", clueRoutes);
app.use("/api/admin/questions", questionRoutes);
app.use("/api/game", gameSessionRoutes);
app.use("/api/admin/suspects", suspectsRouter);
app.use("/api", statsRouter);

app.get("/", (req, res) => {
    res.json({
        message: "API is running",
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();

const suspectsRouter = require("./routes/suspect.route.js");
const statsRouter = require("./routes/stats.route.js");

const app = express();
app.use(express.json());


app.use("/api/admin/suspects", suspectsRouter);
app.use("/api", statsRouter);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer();
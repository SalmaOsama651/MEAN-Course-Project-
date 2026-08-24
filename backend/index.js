const express = require("express");
const connectDB = require("./config/db.config.js");
const caseRoutes = require("./routes/cases.routes.js");

const app = express();

app.use(express.json());

connectDB();

app.use("/api", caseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
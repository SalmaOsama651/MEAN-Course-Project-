const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express()
//db
connectDB();
app.use(express.json());
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//routes
const gameSessionRoutes = require('./routes/gameSession.routes');

app.use('/api/game', gameSessionRoutes);









////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
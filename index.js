const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`);
const db = mongoose.connection;

// Check DB connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (error) => {
  console.log(error);
});

// Body-Parse Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error catching endware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({
    statusCode: status,
    msg: message,
  });
});

// Initialize Express Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

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

const express = require("express");
const router = express.Router();

// Get Logged in user
router.get("/user", (req, res) => {
  res.send("User");
});

// Register Process
router.post("/register", async (req, res, next) => {
  const { email, password, password2 } = req.body;

  // Validations

  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Email is required!`,
    });
  }

  if (!password) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password is required!`,
    });
  }

  if (!password2) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password confirmation is required!`,
    });
  }

  if (password !== password2) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password and Password Confirmation not match!`,
    });
  }
});

module.exports = router;

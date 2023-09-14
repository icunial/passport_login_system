const express = require("express");
const router = express.Router();

// Get Logged in user
router.get("/user", (req, res) => {
  res.send("User");
});

module.exports = router;

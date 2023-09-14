const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

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

  // Hash Password and Create User
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return next(err);
      }
      try {
        const userCreated = await User.create({
          email,
          password: hash,
        });
        if (userCreated) {
          return res.status(201).json({
            statusCode: 201,
            data: userCreated,
          });
        }
      } catch (error) {
        return next(error);
      }
    });
  });
});

module.exports = router;

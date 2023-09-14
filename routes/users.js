const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const passport = require("passport");

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
        const userFound = await User.findOne({
          email,
        });
        if (userFound) {
          console.log(userFound);
          return res.status(400).json({
            statusCode: 400,
            msg: `Email address is not available. Try with a new one!`,
          });
        }

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

// Login Process
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
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

  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        msg: info.msg,
      });
    }
    req.logIn(user, (error) => {
      if (error) return next(error);
      return res.status(200).send(true);
    });
  })(req, res, next);
});

module.exports = router;

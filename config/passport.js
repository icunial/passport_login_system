const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

require("dotenv").config();

module.exports = (passport) => {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          //Match Email
          const userFound = await User.findOne({ email: email });
          if (userFound) {
            // Match Password
            bcrypt.compare(password, userFound.password, (err, isMatch) => {
              if (err) {
                return done(err, null);
              }
              if (isMatch) {
                return done(null, userFound);
              } else {
                return done(null, false, { msg: `Incorrect password!` });
              }
            });
          } else {
            return done(null, false, { msg: `Incorrect email!` });
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  //Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/users/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const userFound = await User.findById(id);
      if (userFound) {
        done(null, userFound);
      } else {
        done(null, { msg: `User not found!` });
      }
    } catch (error) {
      done(error, null);
    }
  });
};

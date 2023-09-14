const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

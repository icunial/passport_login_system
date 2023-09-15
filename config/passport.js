const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const GoogleUser = require("../models/GoogleUser");
const GithubUser = require("../models/GithubUser");
const bcrypt = require("bcryptjs");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

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

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/users/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userFound = await GoogleUser.findOne({ id: profile.id });

          if (userFound) {
            done(null, userFound);
          } else {
            const userCreated = await GoogleUser.create({
              id: profile.id,
              email: profile.emails[0].value,
            });
            if (userCreated) {
              done(null, userCreated);
            }
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Github Strategy
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scope: ["email"],
        callbackURL: "/users/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const userFound = await GithubUser.findOne({ id: profile.id });
          if (userFound) {
            done(null, userFound);
          } else {
            const userCreated = await GithubUser.create({
              id: profile.id,
              email: profile.email,
            });
            if (userCreated) {
              done(null, userCreated);
            }
          }
        } catch (error) {
          done(error, null);
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
        const googleUserFound = await GoogleUser.findById(id);
        if (googleUserFound) {
          done(null, googleUserFound);
        } else {
          const githubUserFound = await GithubUser.findById(id);
          if (githubUserFound) {
            done(null, githubUserFound);
          } else {
            done(null, { msg: `User not found!` });
          }
        }
      }
    } catch (error) {
      done(error, null);
    }
  });
};

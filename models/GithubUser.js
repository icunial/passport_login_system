const mongoose = require("mongoose");

// GithubUser Schema
const githubUserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const GithubUser = (module.exports = mongoose.model(
  "GithubUser",
  githubUserSchema
));

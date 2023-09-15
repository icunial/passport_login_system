const mongoose = require("mongoose");

// GoogleUser Schema
const googleUserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const GoogleUser = (module.exports = mongoose.model(
  "GoogleUser",
  googleUserSchema
));

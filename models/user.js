const mongoose = require("mongoose");

// ✅ FIX for Node 20+ / Node 22
const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose); // ✅ now a function

module.exports = mongoose.model("User", userSchema);

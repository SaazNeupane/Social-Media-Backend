const mongoose = require(`mongoose`);
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: [`guest`, `user`, `admin`],
    default: `user`,
  },
  authProvider: {
    type: String,
    enum: [`google`, `facebook`],
  },
  profileId: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

//Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/yatinkathuria2020/image/upload/v1609571937/bhareth-np_iawl1e.jpg",
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  resetToken: {
    type: String,
  },
  expireToken: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userScheme);

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
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
  website: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
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
  // savedPosts: [
  //   {
  //     type: ObjectId,
  //     ref: "Post",
  //   },
  // ],
});

module.exports = mongoose.model("User", userScheme);

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: { type: String },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
        commentLikes: [
          {
            type: ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    savedBy: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postScheme);

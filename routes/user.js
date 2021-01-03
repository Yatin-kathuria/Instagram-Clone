const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");
const User = require("../models/user");

router.get("/users/:id", requireLogin, (req, res) => {
  // find the user
  User.findById({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      //find the post of partcular user
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error });
          }
          res.json({
            user,
            posts,
          });
        });
    })
    .catch((error) => {
      return res.status(404).json({ error: "user not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.body.followId },
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((error, followersResult) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((error, followingResult) => {
          if (error) {
            return res.status(422).json({
              error,
            });
          }
          res.json({ followersResult, followingResult });
        });
    });
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unFollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((error, followersResult) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unFollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((error, followingResult) => {
          if (error) {
            return res.status(422).json({
              error,
            });
          }
          res.json({ followersResult, followingResult });
        });
    });
});

router.put("/updatpic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: { pic: req.body.pic },
    },
    {
      new: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(422).json({
        error: "unable to upload the pic",
      });
    }
    res.json(result);
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");
const User = require("../models/user");

router.get("/users/:username", requireLogin, (req, res) => {
  // find the user
  User.findOne({ username: req.params.username })
    .select("-password")
    .then((user) => {
      //find the post of partcular user
      Post.find({ postedBy: user._id })
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
    .select("-password")
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

router.put("/updatepic", requireLogin, (req, res) => {
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
    return res.json(result);
  });
});

router.put("/edit", requireLogin, async (req, res) => {
  const { _id, name, username, website, bio, email, phoneNumber } = req.body;
  let updateField = {};
  let phoneError = "";
  await User.findOne({ username: username })
    .then(async (savedUsername) => {
      if (savedUsername && savedUsername._id != _id) {
        return res.status(422).json({
          error: "This username isn't available. Please try another.",
        });
      }
      if (website) {
        const isWebsiteValid = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
          website
        );
        if (!isWebsiteValid) {
          return res.status(422).json({
            error: "enter a valid website",
          });
        }
      }
      await User.findOne({ email: email })
        .then(async (savedEmail) => {
          if (savedEmail && savedEmail._id != _id) {
            return res.status(422).json({
              error: "This email is linked with another account.",
            });
          }
          updateField = {
            name,
            username,
            website,
            bio,
            email,
          };

          if (phoneNumber) {
            await User.findOne({ phoneNumber: phoneNumber })
              .then((savedPhone) => {
                if (savedPhone) {
                  if (savedPhone._id != _id) {
                    // return res.status(422).json({
                    phoneError =
                      "This Phone number is linked with another account.";
                    // });
                  } else {
                    updateField.phoneNumber = phoneNumber;
                  }
                } else {
                  updateField.phoneNumber = phoneNumber;
                }
              })
              .catch((err) => console.log(err));
          } else {
            updateField.phoneNumber = "";
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  await User.findByIdAndUpdate(
    { _id: _id },
    {
      $set: updateField,
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({
          error: "unable to update . try after someTime",
        });
      }
      if (result) {
        return res.json({ result, phoneError });
      }
    });
});

router.post("/search-users", requireLogin, (req, res) => {
  let userPattern = new RegExp("^" + req.body.query, "i");

  User.find({ username: { $regex: userPattern } })
    .select("_id username pic")
    .exec((error, user) => {
      if (error) {
        return res.status(422).json({
          error: "unable to upload the pic",
        });
      }
      res.json(user);
    });
});

module.exports = router;

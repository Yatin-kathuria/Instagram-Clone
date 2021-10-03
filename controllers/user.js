const Post = require("../models/post");
const User = require("../models/user");

class UserController {
  async getUsers(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username }).select(
        "-password"
      );
      if (!user) {
        throw new Error("user not found");
      }
      Post.find({ postedBy: user._id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            throw new Error(error);
          }
          res.json({ user, posts });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async follow(req, res) {
    try {
      User.findByIdAndUpdate(
        { _id: req.body.followId },
        { $push: { followers: req.user._id } },
        { new: true }
      )
        .select("-password")
        .exec((error, followersResult) => {
          if (error) {
            throw new Error(error);
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
          )
            .select("-password")
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .exec((error, followingResult) => {
              if (error) {
                throw new Error(error);
              }
              res.json({ followersResult, followingResult });
            });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async unfollow(req, res) {
    try {
      User.findByIdAndUpdate(
        req.body.unFollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
      )
        .select("-password")
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((error, followersResult) => {
          if (error) {
            throw new Error(error);
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unFollowId } },
            { new: true }
          )
            .select("-password")
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .exec((error, followingResult) => {
              if (error) {
                throw new Error(error);
              }
              res.json({ followersResult, followingResult });
            });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async updatepic(req, res) {
    try {
      User.findByIdAndUpdate(
        { _id: req.user._id },
        { $set: { pic: req.body.pic } },
        { new: true }
      ).exec((error, result) => {
        if (error) {
          throw new Error(error);
        }
        res.json(result);
      });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async edit(req, res) {
    try {
      const { _id, name, username, website, bio, email, phoneNumber } =
        req.body;
      let updateField = {};
      let phoneError = "";
      const savedUsername = await User.findOne({ username: username });
      if (savedUsername && savedUsername._id != _id) {
        throw new Error("This username isn't available. Please try another.");
      }
      if (website) {
        const isWebsiteValid =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
            website
          );
        if (!isWebsiteValid) {
          throw new Error("enter a valid website");
        }
      }
      const savedEmail = await User.findOne({ username: username });
      if (savedEmail && savedEmail._id != _id) {
        throw new Error("This email is linked with another account.");
      }

      updateField = {
        name,
        username,
        website,
        bio,
        email,
        phoneNumber: "",
      };

      if (phoneNumber) {
        const savedPhone = await User.findOne({ phoneNumber: phoneNumber });
        if (savedPhone && savedPhone._id != _id) {
          throw new Error("This Phone number is linked with another account.");
        } else {
          updateField.phoneNumber = phoneNumber;
        }
      }

      User.findByIdAndUpdate({ _id: _id }, { $set: updateField }, { new: true })
        .select("-password")
        .exec((error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.json({ result, phoneError });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async searchUsers(req, res) {
    try {
      let userPattern = new RegExp("^" + req.body.query, "i");

      User.find({ username: { $regex: userPattern } })
        .select("_id username pic")
        .exec((error, user) => {
          if (error) {
            throw new Error(error);
          }
          res.json(user);
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }
}

module.exports = new UserController();

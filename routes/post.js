const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({
      error: "please add all the fields",
    });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((post) => {
      res.json({ post });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id username pic")
    // .populate("savedPosts")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic username")
    .sort("-createdAt")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.id,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic username")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.id,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic username")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  console.log(req.params.postId);
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({
          error,
        });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json({
              result,
            });
          })
          .catch((error) => {
            return res.status(422).json({
              error,
            });
          });
      }
    });
});

router.delete("/deletecomment/:postId&:commentId", requireLogin, (req, res) => {
  const { postId, commentId } = req.params;

  Post.findById({ _id: postId }).exec((error, post) => {
    if (error || !post) {
      return res.status(422).json({
        error,
      });
    }
    if (post) {
      // const newPost = { ...post._doc };
      let comments = post.comments;
      comments = comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
      Post.findByIdAndUpdate(
        { _id: postId },
        {
          comments,
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .exec((error, result) => {
          if (error) {
            return res.status(422).json({
              error,
            });
          } else {
            res.json(result);
          }
        });
    }
  });
});

router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: [...req.user.following, req.user._id] } })
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic username")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put("/unsaved-post", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $pull: { savedBy: req.user._id },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((error, savedPostResult) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      }

      return res.json({ savedPostResult });
    });
});

router.put("/saved-post", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $push: { savedBy: req.user._id },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((error, savedPostResult) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      }

      return res.json({ savedPostResult });
    });
});

router.get("/getsavedpost/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  Post.find({ savedBy: { $in: id } })
    .populate("postedBy", "_id pic username")
    .populate("comments.postedBy", "_id pic username")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => console.log(error));
});

module.exports = router;

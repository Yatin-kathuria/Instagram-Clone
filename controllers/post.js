const mongoose = require("mongoose");
const Post = require("../models/post");

class PostControler {
  async createPost(req, res) {
    try {
      const { title, body, pic } = req.body;
      if (!title || !body || !pic) {
        throw new Error("please add all the fields");
      }
      req.user.password = undefined;
      const post = new Post({
        title,
        body,
        pic,
        postedBy: req.user,
      });
      const savedPost = await post.save();

      if (!savedPost) {
        throw new Error("Something went wrong , please try again later");
      }

      res.json({ post });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async allPost(req, res) {
    try {
      const posts = await Post.find()
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id username pic")
        .sort("-createdAt");

      res.json({ posts });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async myPost(req, res) {
    try {
      const mypost = await Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .sort("-createdAt");

      res.json({ mypost });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async like(req, res) {
    try {
      Post.findByIdAndUpdate(
        req.body.id,
        { $push: { likes: req.user._id } },
        { new: true }
      )
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .exec((error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.json(result);
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async unlike(req, res) {
    try {
      Post.findByIdAndUpdate(
        req.body.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic")
        .exec((error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.json(result);
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async comment(req, res) {
    try {
      const comment = {
        text: req.body.text,
        postedBy: req.user._id,
      };

      Post.findByIdAndUpdate(
        req.body.id,
        { $push: { comments: comment } },
        { new: true }
      )
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .exec((error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.json(result);
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async deletepost(req, res) {
    try {
      Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec(async (error, post) => {
          if (error || !post) {
            throw new Error(error);
          }
          if (post.postedBy._id.toString() === req.user._id.toString()) {
            const result = await post.remove();
            res.json({ result });
          }
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async deletecomment(req, res) {
    try {
      const { postId, commentId } = req.params;

      Post.findById({ _id: postId }).exec((error, post) => {
        if (error || !post) {
          throw new Error(error);
        }

        let comments = post.comments;
        comments = comments.filter(
          (comment) => comment._id.toString() !== commentId
        );

        Post.findByIdAndUpdate({ _id: postId }, { comments }, { new: true })
          .populate("postedBy", "_id pic username")
          .populate("comments.postedBy", "_id pic username")
          .exec((error, result) => {
            if (error) {
              throw new Error(error);
            }
            res.json(result);
          });
      });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async getsubpost(req, res) {
    try {
      const posts = await Post.find({
        postedBy: { $in: [...req.user.following, req.user._id] },
      })
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .sort("-createdAt");
      res.json({ posts });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async unsavedPost(req, res) {
    try {
      Post.findByIdAndUpdate(
        { _id: req.body.id },
        { $pull: { savedBy: req.user._id } },
        { new: true }
      )
        .select("-password")
        .exec((error, savedPostResult) => {
          if (error) {
            throw new Error(error);
          }

          res.json({ savedPostResult });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async savedPost(req, res) {
    try {
      Post.findByIdAndUpdate(
        { _id: req.body.id },
        { $push: { savedBy: req.user._id } },
        { new: true }
      )
        .select("-password")
        .exec((error, savedPostResult) => {
          if (error) {
            throw new Error(error);
          }

          res.json({ savedPostResult });
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async getsavedpost(req, res) {
    try {
      const { id } = req.params;
      const posts = await Post.find({ savedBy: { $in: id } })
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .sort("-createdAt");
      res.json({ posts });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async likeComment(req, res) {
    try {
      const { commentId, postId } = req.body;
      Post.findById(postId)
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .exec(async (error, result) => {
          if (error) {
            throw new Error(error);
          }
          const newcomments = result.comments.map((comment) => {
            if (comment._id == commentId) {
              return {
                ...comment._doc,
                commentLikes: [...comment._doc.commentLikes, req.user._id],
              };
            }
            return comment;
          });
          result.comments = newcomments;
          const post = await result.save();
          res.json(post);
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async unlikeComment(req, res) {
    try {
      const { commentId, postId } = req.body;
      Post.findById(postId)
        .populate("postedBy", "_id pic username")
        .populate("comments.postedBy", "_id pic username")
        .exec(async (error, result) => {
          if (error) {
            throw new Error(error);
          }
          if (result) {
            const newcomments = result.comments.map((comment) => {
              if (comment._id == commentId) {
                const newCommentLikes = comment._doc.commentLikes.filter(
                  (id) => {
                    if (id != req.user._id) {
                      return;
                    }
                    return id;
                  }
                );

                return {
                  ...comment._doc,
                  commentLikes: newCommentLikes,
                };
              }

              return comment;
            });

            result.comments = newcomments;
            const post = await result.save();
            res.json(post);
          }
        });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }
}

module.exports = new PostControler();

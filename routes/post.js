const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const postControler = require("../controllers/post");

router.post("/createpost", requireLogin, postControler.createPost);
router.get("/allpost", requireLogin, postControler.allPost);
router.get("/mypost", requireLogin, postControler.myPost);
router.put("/like", requireLogin, postControler.like);
router.put("/unlike", requireLogin, postControler.unlike);
router.put("/comment", requireLogin, postControler.comment);
router.delete("/deletepost/:postId", requireLogin, postControler.deletepost);
router.delete(
  "/deletecomment/:postId&:commentId",
  requireLogin,
  postControler.deletecomment
);
router.get("/getsubpost", requireLogin, postControler.getsubpost);
router.put("/unsaved-post", requireLogin, postControler.unsavedPost);
router.put("/saved-post", requireLogin, postControler.savedPost);
router.get("/getsavedpost/:id", requireLogin, postControler.getsavedpost);
router.put("/like_comment", requireLogin, postControler.likeComment);
router.put("/unlike_comment", requireLogin, postControler.unlikeComment);

module.exports = router;

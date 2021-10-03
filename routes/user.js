const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const userController = require("../controllers/user");

router.get("/users/:username", requireLogin, userController.getUsers);
router.put("/follow", requireLogin, userController.follow);
router.put("/unfollow", requireLogin, userController.unfollow);
router.put("/updatepic", requireLogin, userController.updatepic);
router.put("/edit", requireLogin, userController.edit);
router.post("/search-users", requireLogin, userController.searchUsers);

module.exports = router;

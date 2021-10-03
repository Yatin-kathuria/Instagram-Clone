const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const requireLogin = require("../middleware/requireLogin");
const transporter = require("../utils/transporter");

// controllers
const authController = require("../controllers/auth");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/resetpassword", authController.resetPassword);
router.post("/newpassword", authController.newPassword);
router.put("/change_password", requireLogin, authController.changePassword);

module.exports = router;

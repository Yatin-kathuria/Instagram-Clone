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

router.post("/newpassword", (req, res) => {
  const { password, token } = req.body;
  User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "try again session expired" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user
          .save()
          .then((user) => {
            res.json({ message: "password updated successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/change_password", requireLogin, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  User.findById({ _id: req.user._id })
    .then((saveduser) => {
      if (!saveduser) {
        return res
          .status(422)
          .json({ error: "Technical error try again after sometime" });
      }
      bcrypt
        .compare(oldPassword, saveduser.password)
        .then((match) => {
          if (!match) {
            return res.status(422).json({
              error:
                "Sorry, old password is incorrect. Please double-check your password.",
            });
          } else {
            bcrypt
              .hash(newPassword, 12)
              .then((hashedPassword) => {
                saveduser.password = hashedPassword;
                saveduser
                  .save()
                  .then((user) => {
                    if (user) {
                      return res.json({
                        message: "password updated successfully",
                      });
                    } else {
                      return res.json({ error: "some technical error" });
                    }
                  })
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

module.exports = router;

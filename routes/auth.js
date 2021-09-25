const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const transporter = require("../utils/transporter");
const usernameValidator = require("../utils/usernameValidator");

// controllers
const authController = require("../controllers/auth");

router.post("/signup", authController.signUp);

router.post("/signin", (req, res) => {
  const { text, password } = req.body;
  User.findOne(usernameValidator(text))
    .then((user) => {
      if (!user) {
        return res.status(422).json({
          error:
            "The username you entered doesn't belong to an account. Please check your username and try again.",
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            //generating token for user
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            const {
              _id,
              name,
              email,
              username,
              followers,
              following,
              pic,
              website,
              bio,
              phoneNumber,
              // savedPosts,
            } = user;
            return res.json({
              token,
              user: {
                _id,
                name,
                email,
                username,
                followers,
                following,
                pic,
                bio,
                website,
                phoneNumber,
                // savedPosts,
              },
            });
          } else {
            return res.status(422).json({
              error:
                "Sorry, your password was incorrect. Please double-check your password.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.status(422).json({ error: "user don't exists with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user
          .save()
          .then((result) => {
            transporter.sendMail({
              to: user.email,
              from: "yatinkathuria2020@gmail.com",
              subject: "password reset",
              html: `<p>You requested for password reset</p>
              <h5>click in this <a href="${process.env.EMAIL}/reset/${token}">link</a> for reset the password</h5>`,
            });
            res.json({ message: "check your email" });
          })
          .catch();
      })
      .catch();
  });
});

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

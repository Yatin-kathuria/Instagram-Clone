const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridtransport = require("nodemailer-sendgrid-transport");

function ValidateInputType(Text) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      Text
    )
  ) {
    return { email: Text };
  }
  if (/^[a-zA-Z0-9]+$/.test(Text)) {
    return { username: Text };
  }
}

const transporter = nodemailer.createTransport(
  sendgridtransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

router.post("/signup", (req, res) => {
  const errors = [];
  let { name, email, password, username } = req.body;
  // if (!pic) {
  //   pic =
  //     "https://res.cloudinary.com/yatinkathuria2020/image/upload/v1609571937/bhareth-np_iawl1e.jpg";
  // }
  if (!email || !name || !password || !username) {
    return res.status(422).json({
      error: "please add all the fields",
    });
  }
  // find user by username
  User.findOne({ username })
    .then((savedUsername) => {
      if (savedUsername) {
        errors.push({
          message: "This username isn't available. Please try another.",
        });
      }
      // find user by email
      User.findOne({ email })
        .then((savedEmail) => {
          if (savedEmail) {
            errors.push({ message: `Another account is using ${email}.` });

            return res.status(422).json(errors);
          } else {
            // encrypt password
            bcrypt.hash(password, 12).then((hashedPassword) => {
              const user = new User({
                name,
                email,
                password: hashedPassword,
                username,
              });
              //saving the user
              user
                .save()
                .then((user) => {
                  transporter.sendMail({
                    to: user.email,
                    from: "yatinkathuria2020@gmail.com",
                    subject: "sign up successfully",
                    html: "<h1>Welcome to instagram</h1>",
                  });
                  return res.json({
                    message: "user saved successfully",
                    user,
                  });
                })
                .catch((error) => console.log(error));
            });
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

router.post("/signin", (req, res) => {
  const { text, password } = req.body;

  User.findOne(ValidateInputType(text))
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

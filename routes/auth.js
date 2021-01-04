const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridtransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridtransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

router.post("/signup", (req, res) => {
  let { name, email, password, pic } = req.body;
  if (!pic) {
    pic =
      "https://res.cloudinary.com/yatinkathuria2020/image/upload/v1609571937/bhareth-np_iawl1e.jpg";
  }
  console.log(name, email, password);
  if (!email || !name || !password) {
    return res.status(422).json({
      error: "please add all the fields",
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(422).json({
          error: "user is already exists with this email",
        });
      } else {
        // encrypt password
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            pic,
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
            .catch((error) => {
              console.log(error);
            });
        });
      }
    })
    .catch((error) => console.log(error));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: "please add all the email and password",
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({
          error: "invalid email or password",
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            //generating token for user
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            const { _id, name, email, followers, following, pic } = user;
            return res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({
              error: "invalid email or password",
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
    .catch();
});

module.exports = router;

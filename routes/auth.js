const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports = router;

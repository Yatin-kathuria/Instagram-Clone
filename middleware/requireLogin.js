const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      error: "you must be logged in",
    });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({
        error: "you must be logged in",
      });
    }
    const { _id } = payload;
    User.findById(_id).then((user) => {
      req.user = user;
      next();
    });
  });
};

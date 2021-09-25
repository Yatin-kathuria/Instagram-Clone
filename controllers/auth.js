const User = require("../models/user");
const bcrypt = require("bcryptjs");
const transporter = require("../utils/transporter");
const usernameValidator = require("../utils/usernameValidator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AuthController {
  async signUp(req, res) {
    let { name, email, password, username } = req.body;
    if (!email || !name || !password || !username) {
      return res.status(422).json({
        error: "please add all the fields",
      });
    }

    try {
      const userWithUsername = await User.findOne({ username });
      if (userWithUsername) {
        throw new Error("This username isn't available. Please try another.");
      }

      const userWithEmail = await User.findOne({ email });

      if (userWithEmail) {
        // res.status(422).json(errors);
        throw new Error(`Another account is using ${email}.`);
      }

      const hashedPassword = await bcrypt.hash(password, 12); // encrypt password

      const user = new User({
        name,
        email,
        password: hashedPassword,
        username,
      });
      const savedUser = await user.save(); // saving the user

      transporter.sendMail({
        to: savedUser.email,
        from: "yatinkathuria2020@gmail.com",
        subject: "sign up successfully",
        html: "<h1>Welcome to instagram</h1>",
      });

      res.json({
        message: "user saved successfully",
        user: savedUser,
      });
    } catch (error) {
      res.status(422).json({
        error: error.message,
      });
    }
  }

  async signIn(req, res) {
    const { text, password } = req.body;

    try {
      const user = await User.findOne(usernameValidator(text));
      if (!user) {
        throw new Error(
          "The username you entered doesn't belong to an account. Please check your username and try again."
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(
          "Sorry, your password was incorrect. Please double-check your password."
        );
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      return res.json({
        token,
        user: user,
      });
    } catch (error) {
      return res.status(422).json({
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const buffer = crypto.randomBytes(32);
      if (!buffer) {
        throw new Error("Somthing went wrong , please try again later.");
      }
      const token = buffer.toString("hex");

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("user don't exists with that email");
        return;
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      await user.save();

      transporter.sendMail({
        to: user.email,
        from: "yatinkathuria2020@gmail.com",
        subject: "password reset",
        html: `<p>You requested for password reset</p>
      <h5>click in this <a href="${process.env.EMAIL}/reset/${token}">link</a> for reset the password</h5>`,
      });

      res.json({ message: "check your email" });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();

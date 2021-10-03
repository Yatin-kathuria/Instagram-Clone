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

  async newPassword(req, res) {
    try {
      const { password, token } = req.body;
      const user = await User.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error("try again session expired");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      await user.save();

      res.json({ message: "password updated successfully" });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const saveduser = await User.findById({ _id: req.user._id });
      if (!saveduser) {
        throw new Error("Technical error try again after sometime");
      }

      const match = await bcrypt.compare(oldPassword, saveduser.password);
      if (!match) {
        throw new Error(
          "Sorry, old password is incorrect. Please double-check your password."
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      saveduser.password = hashedPassword;

      const user = await saveduser.save();
      if (!user) {
        throw new Error("some technical error");
      }

      res.json({ message: "password updated successfully" });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const transporter = require("../utils/transporter");

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
        errors: [error.message],
      });
    }
  }
}

module.exports = new AuthController();

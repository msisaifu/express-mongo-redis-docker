const bcrypt = require("bcryptjs");
const User = require("./../models/userModel");

exports.createUser = async (req, res, next) => {
  const { username, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 12);
  try {
    const user = await User.findOne({
      username,
    });
    if (user) {
      return res.status(401).json({
        status: "failed",
        message: "username already exist",
      });
    }

    const new_user = await User.create({
      username,
      password: hashpassword,
    });
    req.session.user = new_user;

    res.status(200).json({
      status: "success",
      data: {
        username: new_user.username,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "user not found",
      });
    }
    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({
        status: "success",
        data: {
          username: user.username,
        },
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "wrong username or password",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

const bcrypt =
require('bcryptjs');

const User =
require('../models/User');

const jwt =
require('jsonwebtoken');

exports.register =
async (req, res) => {

  const user =
    await User.create(req.body);

  const token =
    jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );

  res.json({
    success: true,
    token,
    user
  });

};

exports.login =
async (req, res) => {

  const {
    email,
    password
  } = req.body;

  const user =
    await User.findOne({
      email
    });

  if (!user) {

    return res.status(400)
    .json({
      success: false,
      message:
        'User tidak ditemukan'
    });

  }

  const valid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!valid) {

    return res.status(400)
    .json({
      success: false,
      message:
        'Password salah'
    });

  }

  const token =
    jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );

  res.json({
    success: true,
    token,
    user
  });

};

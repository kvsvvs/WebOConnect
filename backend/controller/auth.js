const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

module.exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10),
      gender: userData.gender,
      phone: userData.phone,
      status: 'Pending',
      date: new Date(),
      profile_pic: null,
      verificationToken: crypto.randomBytes(20).toString('hex'),
    });

    const authToken = jwt.sign({ id: user.id }, process.env.JWTPRIVATEKEY);
    res.status(201).json({ success: true, user, authToken });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.updateProfile = async (req, res) => {
  // Updated to use Sequelize methods.
  const userId = req.user.id;

  const { phone } = req.body;

  const updatedFields = {
    phone,
  };

  if (req.file) {
    updatedFields.profile_pic = './uploads/' + req.file.filename;
  }

  const user = await User.update(updatedFields, {
    where: { id: userId },
    returning: true,
  });

  if (!user[0]) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, user: user[1][0] });
};

module.exports.loginUser = async (req, res) => {
  // Updated to use Sequelize methods.
  const { email, password } = req.body;
  const foundUser = await User.findOne({ where: { email: email.trim() } });

  if (foundUser && bcrypt.compareSync(password.trim(), foundUser.password)) {
    const authToken = jwt.sign({ id: foundUser.id }, process.env.JWTPRIVATEKEY);
    res.status(201).json({ success: true, authToken });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials!' });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.getUser = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  if (user) {
    user.password = undefined;
  }
  res.status(201).json(user);
};
module.exports.deleteUser = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);

  if (user) {
    await user.destroy();
    res.status(200).json({ message: 'User profile deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
module.exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError('Email Could be Sent , Please register first', 404);
  }
  const resetToken = await user.getResetPasswordToken();

  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/passwordReset/${resetToken}`;

  try {
    await sendEmail(user.email, 'password-reset', { resetLink: resetUrl });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ExpressError('Email could not be sent', 500));
  }

  res.status(201).json({ success: true, message: 'Email sent successfully' });
};
module.exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError('Invalid Token', 404);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Password Reset Success' });
};

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

module.exports.createUser = async (req, res) => {
  // Updated to use Sequelize methods.
  const { name, email, password, cpassword, userType } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    cpassword,
    userType,
    verificationToken: crypto.randomBytes(20).toString('hex'),
  });

  // Updated to use Sequelize methods.
  const resp = await user.save();

  const verificationLink = `${req.protocol}://${req.get('host')}/auth/verify/${
    user.verificationToken
  }`;

  await sendEmail(user.email, 'verification', { verificationLink });

  const authToken = jwt.sign({ id: user.id }, process.env.JWTPRIVATEKEY);
  res.status(201).json({ success: true, user: resp, authToken });
};

module.exports.updateProfile = async (req, res) => {
  // Updated to use Sequelize methods.
  const userId = req.user.id;

  const { phone, address, department, designation, dateOfJoining, salary } =
    req.body;

  const updatedFields = {
    phone,
    address,
    department,
    designation,
    dateOfJoining,
    salary,
  };

  if (req.file) {
    updatedFields.profilePicture = './uploads/' + req.file.filename;
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
    if (!foundUser.verified) {
      return res
        .status(401)
        .json({ success: false, message: 'Email not verified' });
    }

    const authToken = jwt.sign({ id: foundUser.id }, process.env.JWTPRIVATEKEY);
    res.status(201).json({ success: true, authToken });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials!' });
  }
};

// Similar changes are applied to other methods as well.

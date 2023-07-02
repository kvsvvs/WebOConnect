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

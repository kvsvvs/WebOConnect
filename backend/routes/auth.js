const express = require('express');
const { grantAccess } = require('../middleware/fetchuser');
const User = require('../models/user');
const {
  createUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  getAllUsers,
  getUsers,
  getUserById,
  deleteUser,
} = require('../controller/auth');
const {
  validateUserRegister,
  validateUserLogin,
  fetchUser,
} = require('../middleware/fetchuser');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uploadFolder = './uploads/';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  '/createuser',
  upload.single('profilePicture'),
  validateUserRegister,
  catchAsync(createUser)
);

router.put(
  '/updateprofile',
  fetchUser,
  upload.single('profilePicture'),
  catchAsync(updateProfile)
);

router.get('/users', catchAsync(getAllUsers));

router.get('/verify/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token.' });
    }
    user.verified = true;
    user.verificationToken = null;
    await user.save();
    res
      .status(200)
      .json({ message: 'Your account has been successfully verified.' });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred during verification.',
      error: error.message,
    });
  }
});
router.post('/login', validateUserLogin, catchAsync(loginUser));
router.get('/getuser', fetchUser, catchAsync(getUser));
router.delete('/deleteprofile', fetchUser, catchAsync(deleteUser));
router.post('/forgotpassword', catchAsync(forgotPassword));
router.put('/resetpassword/:resetToken', catchAsync(resetPassword));
router.get('/user/:userId', fetchUser, catchAsync(getUserById));
module.exports = router;

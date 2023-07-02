require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { UserSchema, UserSchemaLogin } = require('../joiSchema');

module.exports.validateUserRegister = (req, res, next) => {
  const { error } = UserSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUserLogin = (req, res, next) => {
  const { error } = UserSchemaLogin.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWTPRIVATEKEY);
      // Fetch the user from the database
      const user = await User.findByPk(data._id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Failed to verify token:', error);
      res.status(401).json({ message: 'Failed to authenticate token' });
    }
  } else {
    res.status(401).json({ message: 'Please authenticate with a valid Token' }); //401 access denied
  }
};

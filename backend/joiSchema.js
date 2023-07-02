const Joi = require('joi');

module.exports.UserSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  cpassword: Joi.string().min(0),
  phone: Joi.string().length(10),
  address: Joi.string().min(3),
  department: Joi.string().min(3),
  designation: Joi.string().min(3),
  dateOfJoining: Joi.date().allow(null),
  salary: Joi.number().min(3),
  userType: Joi.string().min(3),
  verified: Joi.boolean(),
  avatar: Joi.string(),
});

module.exports.UserSchemaLogin = Joi.object({
  email: Joi.string().required().min(3).max(100),
  password: Joi.string().required().min(4),
});

const Joi = require('joi');

module.exports.UserSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  phone: Joi.string().length(10),
  gender: Joi.string().min(3),
  avatar: Joi.string(),
});

module.exports.UserSchemaLogin = Joi.object({
  email: Joi.string().required().min(3).max(100),
  password: Joi.string().required().min(4),
});

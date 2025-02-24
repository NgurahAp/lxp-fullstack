import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "instructor", "admin").optional(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Digunakan untuk get dan juga logout user API
const getUserValidation = Joi.string().max(100).required();

const resetTokenValidation = Joi.string().email().required()

export { registerUserValidation, loginUserValidation, getUserValidation, resetTokenValidation };

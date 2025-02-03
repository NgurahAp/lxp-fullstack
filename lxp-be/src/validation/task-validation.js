import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().max(255).required(),
  taskQuestion: Joi.string().max(255).required(),
  taskScore: Joi.number().min(0).default(0),
});

export { createTaskValidation };

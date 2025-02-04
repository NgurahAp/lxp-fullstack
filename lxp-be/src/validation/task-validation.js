import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().max(255).required(),
  taskQuestion: Joi.string().max(255).required(),
  taskScore: Joi.number().min(0).default(0),
});

const getDetailTaskValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
  taskId: Joi.number().positive().required(),
});

export { createTaskValidation, getDetailTaskValidation };
